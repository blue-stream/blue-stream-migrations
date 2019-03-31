const config = require('../config');
const log = require('../logger');

module.exports = async (SQL, playlistId) => {
    const playlists = await SQL.Category.findAll({ raw: true });

    const currentPlaylist = playlists.find(p => p.pid == playlistId);
    if (!currentPlaylist) return null;
    let parent_id;
    let parentPlaylist;

    parent_id = currentPlaylist.parent_id;

    while (parent_id != 0) {
        parentPlaylist = playlists.filter((p) => p.pid == parent_id)[0];

        parent_id = parentPlaylist.parent_id;
    }

    return parentPlaylist.pid;
}