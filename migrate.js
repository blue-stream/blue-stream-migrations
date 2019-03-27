import videoSqlScheme from './models/sql/video'
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

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



sequelize.close()