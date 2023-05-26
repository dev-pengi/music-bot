import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const appendFileAsync = promisify(fs.appendFile);

/**
 * Logs an error to a log file, with one file per day.
 * @param error - The error object to be logged.
 * @returns A Promise that resolves to a boolean indicating the success of the logging operation.
 */
async function logError(error: Error): Promise<boolean> {
    const date: Date = new Date();
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();
    const hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    const seconds: number = date.getSeconds();
    const fileName: string = `error-log-${year}-${month}-${day}.log`;
    const logDirectory: string = path.join(__dirname, 'errors');

    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
        console.log(`Created the 'errors' directory.`);
    }

    const errorMessage: string = `Time: ${hours}:${minutes}:${seconds}\nError: ${error.message}\nStack trace: ${error.stack}\n`;
    const separator: string = '----------------------------------------\n\n\n';

    try {
        await appendFileAsync(path.join(logDirectory, fileName), separator + errorMessage);
        console.log(`Error logged to file ${fileName}`);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default logError;