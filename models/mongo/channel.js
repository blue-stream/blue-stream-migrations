const mongoose = require('mongoose');
const connectionString = require('../../config').mongo.channel;


const channelSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        isProfile: {
            type: Boolean,
            default: false,
        },
    },
    {
        versionKey: false,
        autoIndex: false,
        timestamps: true,
        id: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret._id;
            },
        },
    });

// channelSchema.index({ name: 1, user: -1 });

module.exports = async () => {
    await mongoose.connect(
        connectionString,
        { useNewUrlParser: true },
    );
    return mongoose.model('Channel', channelSchema);
};