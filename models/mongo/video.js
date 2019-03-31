const mongoose = require('mongoose');
const connectionString = require('../../config').mongo.video;
const VideoStatus = require('./videoStatus');

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: String,
        owner: {
            type: String,
            required: true,
        },
        contentPath: {
            type: String,
        },
        thumbnailPath: {
            type: String,
        },
        previewPath: {
            type: String,
        },
        originalPath: {
            type: String,
        },
        status: {
            type: String,
            enum: Object.keys(VideoStatus),
            default: VideoStatus.PENDING,
        },
        tags: [{
            type: String,
        }],
        published: {
            type: Boolean,
            default: false,
        },
        publishDate: {
            type: Date,
        },
        views: {
            type: Number,
            default: 0,
        },
        channel: {
            type: String,
            required: true,
        },
        classificationSource: {
            type: Number,
        },
        pp: {
            type: Number,
        },
    },
    {
        autoIndex: false,
        timestamps: true,
        id: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    });

module.exports = (conn) => {
    return conn.model('Video', videoSchema);
};