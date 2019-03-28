module.exports = async (SQL, MONGO) => {
    const playlistToChannelMap = {};
    const playlists = await SQL.Category.findAll({ raw: true });
    let currentPlaylist;
    let channelName;
    let parent_id;
    let parentPlaylist;

    for (let i = 0; i < playlists.length; i++) {
        currentPlaylist = playlists[i];
        channelName = currentPlaylist.playlist_name;
        parent_id = currentPlaylist.parent_id;



        while (parent_id != 0) {
            parentPlaylist = playlists.map((p) => p.pid == parent_id)[0];

            channelName = `${channelName}/${parentPlaylist.playlist_name}`;
            parent_id = parentPlaylist.parent_id;
        }

        //Mongo...
    }

    return playlistToChannelMap;
}