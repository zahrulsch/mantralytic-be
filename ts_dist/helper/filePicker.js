import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
const __dirname = path.resolve();
const storageDir = process.env.NODE_ENV !== 'production' ? 'src/storage/' : 'storage';
const fileReader = promisify(fs.readFile.bind(fs));
export const cookieFilePicker = async (filename = 'cookie.json', options = { parseToJSON: true }) => {
    try {
        const fileDirname = path.resolve(__dirname, storageDir + '/cookie');
        const filePath = path.join(fileDirname, filename);
        const file = await fileReader(filePath, 'utf-8');
        if (options.parseToJSON)
            return JSON.parse(file);
        return file;
    }
    catch {
        throw new Error('Cookie parser error');
    }
};
