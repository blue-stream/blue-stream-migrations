const config = require('../config');
const log = require('../logger');

module.exports = async (SQL, MONGO) => {
    const playlistToChannelMap = {};

    const parentPlaylists = await SQL.Category.findAll({ raw: true, where: { parent_id: 0 } });

    //Mongo

    parentPlaylists.forEach(parentPlaylist => {
        channel = await MONGO.Channel.findOne({ name: parentPlaylist.playlist_name });

        if (!channel) {
            channel = MONGO.Channel.create({ name: channelName, user: config.user })
            log(`${channelName} channel created`);
        } else {
            log(`${channelName} channel already exists`);
        }

        playlistToChannelMap[parentPlaylist.pid] = channel.id;
    });

    return playlistToChannelMap;
}