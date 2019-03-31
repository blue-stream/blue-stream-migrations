const migrateChannel = require('./scripts/migrate_channels');
const migrateVideo = require('./scripts/migrate_videos');
const mongoose = require('mongoose');
const fs = require('fs');

const videoSqlScheme = require('./models/sql/video');
const tagSqlScheme = require('./models/sql/tag');
const categorySqlScheme = require('./models/sql/category');
const video2categorySqlScheme = require('./models/sql/video2category');
const config = require('./config')

const SQL_connectionURI = config.sql.db;

const Sequelize = require('sequelize');
const sequelize = new Sequelize(SQL_connectionURI, {
    define: {
        timestamps: false,
    }
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('[SQL] connected');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        throw err;
    }

    try {
        fs.unlinkSync(config.log.path);
    } catch (e) {
        console.log('Create log file');
    }

    console.log('[logger] initiated')

    let Video = await sequelize.define('wp_hdflvvideoshare', videoSqlScheme, { freezeTableName: true });
    let Video2category = await sequelize.define('wp_hdflvvideoshare_med2play', video2categorySqlScheme, { freezeTableName: true });
    let Category = await sequelize.define('wp_hdflvvideoshare_playlist', categorySqlScheme, { freezeTableName: true });
    let Tags = await sequelize.define('wp_hdflvvideoshare_tags', tagSqlScheme, { freezeTableName: true });

    const SQL = { Video, Video2category, Tags, Category };

    //Mongo connections
    const channelConn = await mongoose.createConnection(
        config.mongo.channel,
        { useNewUrlParser: true },
    );
    const videoConn = await mongoose.createConnection(
        config.mongo.video,
        { useNewUrlParser: true },
    );
    Video = require('./models/mongo/video')(videoConn);
    Channel = require('./models/mongo/channel')(channelConn);
    const MONGO = { Video, Channel };

    console.log('Start migrate channels...');
    const playlistToChannelMap = await migrateChannel(SQL, MONGO);

    console.log('Start migrate videos...');
    await migrateVideo(SQL, MONGO, playlistToChannelMap);

    await sequelize.close();
    console.log('[SQL] connection closed');
})();
