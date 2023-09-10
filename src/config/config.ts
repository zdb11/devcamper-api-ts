import dotenv from 'dotenv';

dotenv.config();

interface ENV {
    NODE_ENV: string | undefined;
    PORT: string | undefined;
    MONGO_URI: string | undefined;
}

interface Config {
    NODE_ENV: string;
    PORT: string;
    MONGO_URI: string;
}

const getConfig = (): ENV => {
    return {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        MONGO_URI: process.env.MONGO_URI
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
