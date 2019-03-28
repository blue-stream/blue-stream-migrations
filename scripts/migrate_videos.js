const limit = 50
module.exports = async (SQL, MONGO) => {
    const videosCount = await SQL.Video.count();

    for (page = 0; page< (videosCount/limit); page++) {
        const videos = await SQL.Video.findAll({ offset: page, limit, raw: true});
        console.log(JSON.stringify(videos))
    }
    
}