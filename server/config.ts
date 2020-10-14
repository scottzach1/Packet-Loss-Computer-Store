import dotenv from "dotenv";

dotenv.config();

export default {
    JWT_SECRET: process.env.JWT_SECRET || 'jwtSampleSecretToken15%^$8',
    MONGO_DB: {
        URI: process.env.MONGO_URI || `mongodb://localhost/computer-parts-store`,
    },
    SERVER: {
        PORT: 3000
    }
};
