const migrateChannel = require('./scripts/migrate_channels');
const migrateVideo = require('./scripts/migrate_videos');
const mongoose = require('mongoose');
const videoSqlScheme = require('./models/sql/video');
const config = require('./config')

const MONGO_connectionURI = config.mongo;
const SQL_connectionURI = config.sql;

const Sequelize = require('sequelize');
const sequelize = new Sequelize(SQL_connectionURI, {
    define: {
        timestamps: false,
    }
});

(async () => {
    try {
        await mongoose.connect(
            MONGO_connectionURI,
            { useNewUrlParser: true },
        );
    
        console.log('[MongoDB] connected');
        await sequelize.authenticate();
        console.log('[SQL] connected');
    } catch(err) {
        console.error('Unable to connect to the database:', err);
        throw err;
    }
    
    const Video = sequelize.define('wp_hdflvvideoshare',videoSqlScheme)
    const Video2category = sequelize.define('wp_hdflvvideoshare_med2play',)
    const Category = sequelize.define('wp_hdflvvideoshare_playlist',);
    const Tags = sequelize.define('wp_hdflvvideoshare_tags',);

    const SQL = {Video,Video2category,Tags,Category};
    
    await sequelize.sync();

    const Video = require('./models/mongo/video');
    const Channel = require('./models/mongo/channel');
    const MONGO = {Video,Channel};

    console.log('Start migrate channels...');
    await migrateChannel(SQL,MONGO);
    
    console.log('Start migrate videos...');
    await migrateVideo(SQL,MONGO);
    
    await sequelize.close();
})();
