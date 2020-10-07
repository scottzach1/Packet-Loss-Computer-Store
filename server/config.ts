export default {
    JWT_SECRET: process.env.JWT_SECRET || 'somesecrettoken',
    MONGO_DB: {
        URI: process.env.MONGODB_URI || `mongodb://:${process.env.MONGO_PORT}localhost/computer-parts-store`,
        USERNAME: process.env.MONGODB_USER,
        PASSWORD: process.env.MONGODB_PASSWORD
    },
    SERVER: {
        PORT: 3000
    }
};
