const config = require('../config');
const log = require('../logger');

module.exports = async (SQL, MONGO) => {
    const playlistToChannelMap = {};

    const parentPlaylists = await SQL.Category.findAll({ raw: true, where: { parent_id: 0 } });

    //Mongo

    await Promise.all(parentPlaylists.map(async (parentPlaylist) => {
        channel = await MONGO.Channel.findOne({ name: parentPlaylist.playlist_name });

        if (!channel) {
            channel = await MONGO.Channel.create({ name: parentPlaylist.playlist_name, user: config.user })
            log(`${parentPlaylist.playlist_name} channel created`);
        } else {
            log(`${parentPlaylist.playlist_name} channel already exists`);
        }

        playlistToChannelMap[parentPlaylist.pid] = channel.id;
    }));

    return playlistToChannelMap;
}