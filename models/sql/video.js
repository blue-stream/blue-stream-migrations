const Sequelize = require('sequelize');

const VideoSchema = {
    vid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    // name: {
    //     type: Sequelize.TEXT
    // },
    // file: {
    //     type: Sequelize.TEXT,
    //     allowNull: true,
    // },
    // image: {
    //     type: Sequelize.TEXT,
    //     allowNull: true,
    // },
    // slug: {
    //     type: Sequelize.TEXT,
    //     allowNull: true,
    // },
    // hitcount: {
    //     type: Sequelize.INTEGER,
    //     defaultValue: 0,
    // },
    // post_date: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    // },
    // source: {
    //     type: Sequelize.STRING,
    //     allowNull: true,
    // },
    // publish_procedure: {
    //     type: Sequelize.INTEGER,
    // },
    // shos: {
    //     type: Sequelize.INTEGER,
    // }
};

module.exports = VideoSchema;