const config = require('../config');
const log = require('../logger');

module.exports = async (SQL, MONGO) => {
    const playlistToChannelMap = {};
    const playlists = await SQL.Category.findAll({ raw: true });
    let currentPlaylist;
    let channelName;
    let parent_id;
    let parentPlaylist;
    let channel;

    for (let i = 0; i < playlists.length; i++) {
        currentPlaylist = playlists[i];
        channelName = currentPlaylist.playlist_name;
        parent_id = currentPlaylist.parent_id;

        while (parent_id != 0) {
            parentPlaylist = playlists.filter((p) => p.pid == parent_id)[0];

            channelName = `${parentPlaylist.playlist_name}/${channelName}`;
            parent_id = parentPlaylist.parent_id;
        }

        //Mongo
        channel = await MONGO.Channel.findOne({ name: channelName });

        if (!channel) {
            channel = MONGO.Channel.create({ name: channelName, user: config.user })
            log(`${channelName} channel created`);
        } else {
            log(`${channelName} channel already exists`);
        }

        playlistToChannelMap[currentPlaylist.pid] = channel.id;

    }

    return playlistToChannelMap;
}