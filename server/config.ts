import dotenv from "dotenv";

dotenv.config();

export default {
    JWT_SECRET: process.env.JWT_SECRET || 'jwtSampleSecretToken15%^$8',
    MONGO_DB: {
        URI: process.env.MONGO_URI || `mongodb://localhost/computer-parts-store`,
    },
    SERVER: {
        PORT: 3000
    },
    GOOGLE_OAUTH2: {
        CLIENT_ID: process.env.GOOGLE_OAUTH2_CLIENT_ID || 'INVALID',
        CLIENT_SECRET: process.env.GOOGLE_OAUTH2_CLIENT_SECRET || 'INVALID'
    },
    GOOGLE_PLACES: {
        API_KEY: process.env.GOOGLE_PLACES_API_KEY || 'INVALID',
    },
    IP_INFO: {
        API_KEY: process.env.IPINFO_API_KEY || 'INVALID',
    },
};
