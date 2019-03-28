import * as mongoose from 'mongoose';

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

export const ChannelModel = mongoose.model('Channel', channelSchema);