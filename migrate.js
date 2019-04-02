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

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}

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
    fs.writeFileSync(config.lastExecutionFile, JSON.stringify({ date: new Date().addHours(3) }))

    await sequelize.close();
    console.log('[SQL] connection closed');
    process.exit(0);
})();
