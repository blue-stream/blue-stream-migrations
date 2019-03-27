import videoSqlScheme from './models/sql/video'
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch(err) {
    console.error('Unable to connect to the database:', err);
}

const VideoSql = sequelize.define('wp_hdflvvideoshare',videoSqlScheme)
const video2category = sequelize.define('wp_hdflvvideoshare_med2play',)


sequelize.close()