const Sequelize = require('sequelize');

export default Video = sequelize.define('wp_hdflvvideoshare', {
    // attributes
    vid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING
        // allowNull defaults to true
    }
}, {
        freezeTableName: true
    });