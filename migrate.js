import { migrateChannel } from './scripts/migrate_channels';
import { migrateVideo } from './scripts/migrate_videos';
import * as mongoose from 'mongoose';
import videoSqlScheme from './models/sql/video'

const MONGO_connectionURI = "mysql://user:pass@example.com:port/dbname";
const SQL_connectionURI = "mysql://user:pass@example.com:port/dbname";

await mongoose.connect(
    MONGO_connectionURI,
    { useNewUrlParser: true },
);

console.log('[MongoDB] connected');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(SQL_connectionURI, {
    define: {
        timestamps: false,

    }
});

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch(err) {
    console.error('Unable to connect to the database:', err);
}

const SQL_video = sequelize.define('wp_hdflvvideoshare',videoSqlScheme)
const SQL_video2category = sequelize.define('wp_hdflvvideoshare_med2play',)
const SQL_category = sequelize.define('wp_hdflvvideoshare_playlist',);
const SQL_tags = sequelize.define('wp_hdflvvideoshare_tags',);

sequelize.sync();

console.log('Start migrate channels...');
migrateChannel(sequelize);

console.log('Start migrate videos...');
migrateVideo(sequelize);

sequelize.close()