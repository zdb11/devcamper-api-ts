import * as fs from 'fs';
import { BootcampModel } from './models/Bootcamp.js';
import { connectDB } from './database/mongo.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}\\..\\_data\\bootcamps.json`, 'utf-8'));
await connectDB();

if (process.argv[2] === '-i') {
    await importData();
} else if (process.argv[2] === '-d') {
    await deleteData();
} else {
    console.log("Choose option");
}
process.exit();

async function importData() {
    try {
        await BootcampModel.create(bootcamps);
        console.log('Data Imported');
    } catch (error) {
        console.log(`Error when creating bootcamps ${error}`);
    }
}

async function deleteData() {
    try {
        await BootcampModel.deleteMany();
        console.log('Data deleted');
    } catch (error) {
        console.log(`Error when deleting data ${error}`);
    }
}
