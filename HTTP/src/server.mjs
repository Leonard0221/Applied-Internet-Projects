import * as webLib from './web-lib.mjs';
import * as path from "path";
import * as fs from "fs";

import { fileURLToPath } from 'url';

// TODO: configure and start server

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configFileDir = path.join(__dirname, 'config.json');

fs.readFile(configFileDir, 'utf-8', (error, data) => {
    if (error) {
        console.log("Error!", error);
    } else {
        const configJson = JSON.parse(data);
        // const directoryRoot = configJson.directoryRoot;
        const redirectMap = configJson["redirect_map"];
        const rootDirectory = configJson["root_directory"];
        const fullPath = path.join(__dirname, "..", rootDirectory);
        const server = new webLib.HTTPServer(fullPath, redirectMap);
        server.listen(3000); // server.listen(8080);
    }
});