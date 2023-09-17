import * as fs from 'fs';
import { BootcampModel } from './models/Bootcamp.js';
import { connectDB } from './database/mongo.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}\\..\\_data\\bootcamps.json`, 'utf-8'));
await connectDB();

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}

async function importData() {
    try {
        await BootcampModel.create(bootcamps);
        console.log('Data Imported');
        process.exit();
    } catch (error) {
        console.log(`Error when creating bootcamps ${error}`);
    }
}

async function deleteData() {
    try {
        await BootcampModel.deleteMany();
        console.log('Data deleted');
        process.exit();
    } catch (error) {
        console.log(`Error when deleting data ${error}`);
    }
}
