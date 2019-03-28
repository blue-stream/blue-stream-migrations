const Sequelize = require('sequelize');

const CategorySchema = {
    pid: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
    },
    playlist_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    parent_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
};

module.exports = CategorySchema;