const limit = 50;
const config = require('../config');
const log = require('../logger');
const VideoStatus = require('../models/mongo/videoStatus');
const sources = require('../sources.json');
const categoryParent = require('./categoryParent');
const categoryTag = require('./categoryTag');

module.exports = async (SQL, MONGO, playlistToChannelMap) => {
    const videosCount = await SQL.Video.count();
    let videos;
    let videosDocs;
    let category;

    for (page = 0; page < (videosCount / limit); page++) {
        videosDocs = [];
        videos = await SQL.Video.findAll({ offset: page, limit, raw: true });
        videosDocs = videos.map(video => {
            if (!video.file || video.file.indexOf('.mp4') == -1) {
                log(`Video with vid ${video.vid} didnt upload. Video's slug: ${video.slug}`)
                return null;
            }

            const videoDoc = {};

            videoDoc.title = video.name;
            videoDoc.description = video.description;
            videoDoc.owner = config.user;
            videoDoc.contentPath = video.file;
            videoDoc.originalPath = video.file;

            videoDoc.thumbnailPath = video.image ? video.image : config.noImagePath;
            videoDoc.previewPath = video.image ? video.image : config.noImagePath;
            videoDoc.status = VideoStatus.READY;
            videoDoc.published = true;
            videoDoc.publishDate = video.post_date;
            videoDoc.views = video.hitcount;



            categoryIds = await SQL.Video2category.findAll({
                where: {
                    media_id: video.vid
                },
                attributes: [playlist_id]
            });

            const parentId = await categoryParent(categoryIds[0]);
            if (!playlistToChannelMap[parentId]) {
                log(`Video with vid ${video.vid} didnt upload. Video's slug: ${video.slug}`)
                return null;
            }

            videoDoc.channel = playlistToChannelMap[parentId];

            const categoryTags = await Promise.all(categoryIds.map(id => categoryTag(id)));
            const tags = await SQL.Tags.findAll({
                where: {
                    media_id: video.vid
                },
                attributes: [tags_name]
            });
            tags.push(categoryTags);
            videoDoc.tags = tags;

            videoDoc.classificationSource = video.source && sources.find((s) => s.name == video.source).id;

            if (video.publish_procedure) {
                videoDoc.pp = video.publish_procedure;
            } else if (video.shos) {
                videoDoc.pp = video.shos;
            }

            return videoDoc;
        }).filter(video => video);

        await MONGO.Video.insertMany(videoDocs);
    }

}