const config = require('../config');
const log = require('../logger');
let playlists;

module.exports = async (SQL, playlistId) => {
    if (!playlists) playlists = await SQL.Category.findAll({ raw: true });

    const currentPlaylist = playlists.find(p => p.pid == playlistId);
    if (!currentPlaylist) return null;
    let tag;
    let parent_id;
    let parentPlaylist;

    tag = currentPlaylist.playlist_name;
    parent_id = currentPlaylist.parent_id;

    while (parent_id != 0) {
        parentPlaylist = playlists.filter((p) => p.pid == parent_id)[0];

        tag = `${parentPlaylist.playlist_name}/${tag}`;
        parent_id = parentPlaylist.parent_id;
    }

    return tag;
}