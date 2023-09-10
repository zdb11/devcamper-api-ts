import express, { type Express } from 'express';
import { router } from './routes/bootcamps.js';
import morgan from 'morgan';
import config from './config/config.js';
import { connectDB } from './database/mongo.js';

const app: Express = express();

if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', router);
try {
    console.log('Preparing database connection.');
    await connectDB();
    app.listen(config.PORT, () => {
        console.log(`[Server]: Server is runnning at http://localhost:${config.PORT}`);
    });
} catch (error) {
    console.log(`Server won't start becasue of error: ${error}`);
}
