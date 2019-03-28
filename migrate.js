const migrateChannel = require('./scripts/migrate_channels');
const migrateVideo = require('./scripts/migrate_videos');
const mongoose = require('mongoose');
const videoSqlScheme = require('./models/sql/video');

const MONGO_connectionURI = "mysql://user:pass@example.com:port/dbname";
const SQL_connectionURI = "mysql://user:pass@example.com:port/dbname";

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
    
    sequelize.sync();
    
    console.log('Start migrate channels...');
    await migrateChannel(SQL);
    
    console.log('Start migrate videos...');
    await migrateVideo(SQL);
    
    sequelize.close()
})();
