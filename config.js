module.exports = {
    mongo: {
        video: `mongodb://${process.env.DB_SERVERS || 'localhost:27018'}/${process.env.VIDEOS_DB_NAME || 'blue-stream-video'}${process.env.DB_REPLICA_NAME ? `?replicaSet=${process.env.DB_REPLICA_NAME}` : ''}`,
        channel: `mongodb://${process.env.DB_SERVERS || 'localhost:27018'}/${process.env.CHANNELS_DB_NAME || 'blue-stream-channel'}${process.env.DB_REPLICA_NAME ? `?replicaSet=${process.env.DB_REPLICA_NAME}` : ''}`,
    },
    sql: {
        db: `mysql://root:aaa@localhost:3306/wordpress`
    }
}