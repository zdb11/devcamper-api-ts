import dotenv from "dotenv";

dotenv.config();

interface ENV {
    NODE_ENV: string | undefined;
    PORT: string | undefined;
    MONGO_URI: string | undefined;
    GEOCODER_PROVIDER: string | undefined;
    GEOCODER_API_KEY: string | undefined;
    FILE_UPLOAD_PATH: string | undefined;
    MAX_FILE_UPLOAD: number | undefined;
    JWT_SECRET: string | undefined;
    JWT_EXPIRE: string | undefined;
    JWT_COOKIE_EXPIRE: number | undefined;
    SMTP_HOST: string | undefined;
    SMTP_PORT: number | undefined;
    SMTP_EMAIL: string | undefined;
    SMTP_PASSWORD: string | undefined;
    FROM_EMAIL: string | undefined;
    FROM_NAME: string | undefined;
}

interface Config {
    NODE_ENV: string;
    PORT: string;
    MONGO_URI: string;
    GEOCODER_PROVIDER: string;
    GEOCODER_API_KEY: string;
    FILE_UPLOAD_PATH: string;
    MAX_FILE_UPLOAD: number;
    JWT_SECRET: string;
    JWT_EXPIRE: string;
    JWT_COOKIE_EXPIRE: number;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_EMAIL: string;
    SMTP_PASSWORD: string;
    FROM_EMAIL: string;
    FROM_NAME: string;
}

const getConfig = (): ENV => {
    return {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        MONGO_URI: process.env.MONGO_URI,
        GEOCODER_PROVIDER: process.env.GEOCODER_PROVIDER,
        GEOCODER_API_KEY: process.env.GEOCODER_API_KEY,
        FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH,
        MAX_FILE_UPLOAD: Number(process.env.MAX_FILE_UPLOAD),
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRE: process.env.JWT_EXPIRE,
        JWT_COOKIE_EXPIRE: Number(process.env.JWT_COOKIE_EXPIRE),
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: Number(process.env.SMTP_PORT),
        SMTP_EMAIL: process.env.SMTP_EMAIL,
        SMTP_PASSWORD: process.env.SMTP_PASSWORD,
        FROM_EMAIL: process.env.FROM_EMAIL,
        FROM_NAME: process.env.FROM_NAME,
    };
};

const getSanitzedConfig = (config: ENV): Config => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }
    return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
