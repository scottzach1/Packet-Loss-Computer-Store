import dotenv from "dotenv";

dotenv.config();

/**
 * Select correct MongoDB URI.
 */
let mongoUrl: string | undefined;

switch (process.env.NODE_ENV) {
    case "production":
        mongoUrl = process.env.MONGO_PROD_URI;
        break;
    case "development":
        mongoUrl = process.env.MONGO_DEV_URI;
        break;
    case "testing":
        mongoUrl = process.env.MONGO_TEST_URI;
        break;
    default:
        mongoUrl = process.env.MONGO_DEV_URI;
}

if (!mongoUrl) {
    console.warn('No Mongo URI could be found, defaulting to `localhost`.');
    mongoUrl = `mongodb://localhost/computer-parts-store`;
}

/**
 * Select correct server port.
 */
let serverPort = process.env.SERVER_PORT;
if (!serverPort) {
    serverPort = "3000";
    console.warn(`No server port was specified, defaulting to ${serverPort}`)
}

/**
 * Warn for other missing variables.
 */
if (!process.env.JWT_SECRET)
    console.warn('No JWT secret could be found, defaulting to unsafe string!')

if (!process.env.GOOGLE_OAUTH2_CLIENT_ID)
    console.warn('No Google OAuth2 Client ID could be found.')

if (!process.env.GOOGLE_OAUTH2_CLIENT_SECRET)
    console.warn('No Google OAuth2 Client Secret could be found.')

if (!process.env.GOOGLE_PLACES_API_KEY)
    console.warn('No Google Places API key could be found.')

if (!process.env.IPINFO_API_KEY)
    console.warn('No IpInfo API key could be found.')

export default {
    JWT_SECRET: process.env.JWT_SECRET || 'jwtSampleSecretToken15%^$8',
    MONGO_DB: {
        URI: mongoUrl,
    },
    SERVER: {
        PORT: serverPort,
    },
    GOOGLE_OAUTH2: {
        CLIENT_ID: process.env.GOOGLE_OAUTH2_CLIENT_ID || 'INVALID',
        CLIENT_SECRET: process.env.GOOGLE_OAUTH2_CLIENT_SECRET || 'INVALID',
    },
    GOOGLE_PLACES: {
        API_KEY: process.env.GOOGLE_PLACES_API_KEY || 'INVALID',
    },
    IP_INFO: {
        API_KEY: process.env.IPINFO_API_KEY || 'INVALID',
    },
    NODE_ENV: process.env.NODE_ENV || 'development',
};
