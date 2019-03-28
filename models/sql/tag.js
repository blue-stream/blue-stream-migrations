const Sequelize = require('sequelize');

const TagSchema = {
    vtag_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    tags_name: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    media_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
    }
};

module.exports = TagSchema;