const config = require('../config');
const limit = config.videoCountPerPage;
const log = require('../logger');
const VideoStatus = require('../models/mongo/videoStatus');
const sources = require('../sources.json');
const categoryParent = require('./categoryParent');
const categoryTag = require('./categoryTag');
const Op = require('Sequelize').Op;

let lastExecution;

module.exports = async (SQL, MONGO, playlistToChannelMap) => {
    log('\nVIDEOS CREATION');
    log('================');

    try {
        lastExecution = require(`../${config.lastExecutionFile}`);
        log(`Fetching videos from ${lastExecution.date}`);
    } catch {
        log('First execution - fetching all videos');
    }

    const videosCount = await SQL.Video.count();
    let videos;
    let videosDocs;

    for (let page = 0; page < (videosCount / limit); page++) {
        videosDocs = [];
        if (!lastExecution) {
            videos = await SQL.Video.findAll({ offset: page * limit, limit, raw: true });
        } else {
            videos = await SQL.Video.findAll({
                offset: page * limit,
                limit,
                raw: true,
                where: {
                    post_date: {
                        [Op.gt]: lastExecution.date,
                    }
                }
            });
        }

        console.log(`#${page}: videos:${videos}`);
        videosDocs = await Promise.all(videos.map(async video => {
            if (!video.file || video.file.indexOf('.mp4') == -1) {
                log(`Video with vid: '${video.vid}' didnt upload - no .mp4 extension. Video's slug: ${video.slug}`)
                return null;
            }

            const videoDoc = {};

            videoDoc.title = video.name;
            videoDoc.description = video.description;
            videoDoc.owner = config.user;
            videoDoc.contentPath = video.file;
            videoDoc.originalPath = video.file;
            videoDoc.publishDate = video.post_date;
            videoDoc.createdAt = video.post_date;
            videoDoc.updatedAt = video.post_date;
            videoDoc.views = video.hitcount;

            videoDoc.status = VideoStatus.READY;
            videoDoc.published = true;

            videoDoc.thumbnailPath = video.image ? video.image : config.noImagePath;
            videoDoc.previewPath = video.image ? video.image : config.noImagePath;

            let categoryIds = await SQL.Video2category.findAll({
                raw: true,
                where: {
                    media_id: video.vid
                },
                attributes: ['playlist_id']
            });

            if (!categoryIds) {
                log(`Video with vid: '${video.vid}' didnt upload, no playlist linked at all. Video's slug: ${video.slug}`)
                return null;
            }

            categoryIds = categoryIds.map(c => c.playlist_id)
            const parentId = await categoryParent(SQL, categoryIds[0]);

            if (!playlistToChannelMap[parentId]) {
                log(`Video with vid: '${video.vid}' didnt upload, no parent playlist linked. Video's slug: ${video.slug}`)
                return null;
            }

            videoDoc.channel = playlistToChannelMap[parentId];

            const categoryTags = await Promise.all(categoryIds.map(id => categoryTag(SQL, id)));
            let tags = await SQL.Tags.findAll({
                raw: true,
                where: {
                    media_id: video.vid
                },
                attributes: ['tags_name']
            });

            if (!tags) {
                tags = [];
            } else {
                tags = tags.map(t => t.tags_name);
            }

            videoDoc.tags = tags.concat(...categoryTags, ...config.defaultVideoTags);

            videoDoc.classificationSource = video.source && sources.find((s) => s.name == video.source).id;

            if (video.publish_procedure) {
                videoDoc.pp = video.publish_procedure;
            } else if (video.shos) {
                videoDoc.pp = video.shos;
            }

            return videoDoc;
        }));

        videosDocs = videosDocs.filter(video => video);
        await MONGO.Video.insertMany(videosDocs);
    }
}