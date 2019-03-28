const limit = 50;

module.exports = async (SQL, MONGO, playlistToChannelMap) => {
    const videosCount = await SQL.Video.count();

    for (page = 0; page < (videosCount / limit); page++) {
        const videos = await SQL.Video.findAll({ offset: page, limit, raw: true });
        console.log(JSON.stringify(videos))
    }

    console.log(JSON.stringify(await SQL.Video2category.findAll({ raw: true })));
    console.log(JSON.stringify(await SQL.Tags.findAll({ raw: true })));
    console.log(JSON.stringify(await SQL.Category.findAll({ raw: true })));
}