const migrateChannel = require('./scripts/migrate_channels');
const migrateVideo = require('./scripts/migrate_videos');
const mongoose = require('mongoose');

const videoSqlScheme = require('./models/sql/video');
const tagSqlScheme = require('./models/sql/tag');
const categorySqlScheme = require('./models/sql/category');
const video2categorySqlScheme = require('./models/sql/video2category');


const MONGO_connectionURI = "mysql://user:pass@example.com:port/dbname";
const SQL_connectionURI = "mysql://root:aaa@localhost:3306/wordpress";

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
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        throw err;
    }

    const Video = await sequelize.define('wp_hdflvvideoshare', videoSqlScheme, { freezeTableName: true });
    const Video2category = await sequelize.define('wp_hdflvvideoshare_med2play', video2categorySqlScheme, { freezeTableName: true });
    const Category = await sequelize.define('wp_hdflvvideoshare_playlist', categorySqlScheme, { freezeTableName: true });
    const Tags = await sequelize.define('wp_hdflvvideoshare_tags', tagSqlScheme, { freezeTableName: true });

    const SQL = { Video, Video2category, Tags, Category };

    await sequelize.sync();

    const Video = require('./models/mongo/video');
    const Channel = require('./models/mongo/channel');
    const MONGO = { Video, Channel };

    console.log('Start migrate channels...');
    await migrateChannel(SQL, MONGO);

    console.log('Start migrate videos...');
    await migrateVideo(SQL, MONGO);

    await sequelize.close();
})();
