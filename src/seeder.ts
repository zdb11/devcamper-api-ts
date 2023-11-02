import * as fs from "fs";
import { BootcampModel } from "./models/Bootcamp.js";
import { CourseModel } from "./models/Course.js";
import { UserModel } from "./models/User.js";
import { connectDB } from "./database/mongo.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}\\..\\_data\\bootcamps.json`, "utf-8"));
const courses = JSON.parse(fs.readFileSync(`${__dirname}\\..\\_data\\courses.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}\\..\\_data\\users.json`, "utf-8"));

await connectDB();

if (process.argv[2] === "-i") {
    await importData();
} else if (process.argv[2] === "-d") {
    await deleteData();
} else {
    console.log("Choose option");
}
process.exit();

async function importData() {
    try {
        await BootcampModel.create(bootcamps);
        await CourseModel.create(courses);
        await UserModel.create(users);
        console.log("Data Imported");
    } catch (error) {
        console.log(`Error when creating models ${error}`);
    }
}

async function deleteData() {
    try {
        await BootcampModel.deleteMany();
        await CourseModel.deleteMany();
        await UserModel.deleteMany();
        console.log("Data deleted");
    } catch (error) {
        console.log(`Error when deleting data ${error}`);
    }
}
