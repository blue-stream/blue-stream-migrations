const Sequelize = require('sequelize');

const Video2categorySchema = {
    rel_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
    },
    media_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
    },
    playlist_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
    }
};

module.exports = Video2categorySchema;