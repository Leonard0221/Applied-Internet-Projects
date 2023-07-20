import * as path from "path";
import * as net from "net";
import * as fs from "fs";
import MarkdownIt from "markdown-it";

const MIME_TYPES = {
    "jpg" : "image/jpg",
    "jpeg" : "image/jpeg",
    "png" : "image/png",
    "html" : "text/html",
    "css" : "text/css",
    "txt" : "text/plain"
};

/**
 * returns the extension of a file name (for example, foo.md returns md)
 * @param fileName (String)
 * @return extension (String)
 */
function getExtension(fileName) {
    const formatPath = path.extname(fileName).toLowerCase();
    if (formatPath.startsWith(".")) {
        return formatPath.substring(1);
    }
    return formatPath;
}

/**
 * determines the type of file from a file's extension (for example,
 * foo.html returns text/html
 * @param: fileName (String)
 * @return: MIME type (String), undefined for unkwown MIME types
 */
function getMIMEType(fileName) {
    const ext = path.extname(fileName);
    return ext.length > 0 ? MIME_TYPES[ext.substring(1)] : null;
}

export class Request {
    constructor(reqStr) {
        const [method, path] = reqStr.split(" ");
        this.method = method;
        this.path = path;
    }
}

export class Response {

    static STATUS_CODES = {
        200 : "OK",
        308 : "Permanent Redirect",
        404 : "Page Not Found",
        500 : "Internal Server Error"
    };

    constructor(socket, statusCode = 200, version = "HTTP/1.1") {
        this.sock = socket;
        this.statusCode = statusCode;
        this.version = version;
        this.headers = {};
        this.body = null;
    }

    setHeader(name, value) {
        this.headers[name] = value;
    }

    status(statusCode) {
        this.statusCode = statusCode;
        return this;
    }

    send(body) {
        this.body = body ?? "";
      
        if (!Object.hasOwn(this.headers, "Content-Type")) {
            this.headers["Content-Type"] = "text/html";
        }

        const statusCodeDesc = Response.STATUS_CODES[this.statusCode];

        const headersString = Object.entries(this.headers).reduce((s, [name, value]) => {
            return s + `${name}: ${value} \r\n`;
        }, "");

        this.sock.write(`${this.version} ${this.statusCode} ${statusCodeDesc}\r\n`);
        this.sock.write(`${headersString}\r\n`);
        this.sock.write(this.body);

        this.sock.end();
    }

    end() {
        this.sock.end();
    }
}

export class HTTPServer {
    constructor(rootDirFull, redirectMap) {
        this.rootDirFull = rootDirFull;
        this.redirectMap = redirectMap;
        this.server = net.createServer(this.handleConnection.bind(this));
    }

    listen(port, host) {
        this.server.listen(port, host);
    }

    handleConnection(sock) {
        sock.on("data", data => this.handleRequest(sock, data));
    }

    handleRequest(sock, binaryData) {
        const request = new Request(binaryData.toString());
        const response = new Response(sock);
        let reqPathFull = path.join(this.rootDirFull, request.path);
        reqPathFull = path.normalize(reqPathFull); // this is probably uneccessary

        // TODO: (see homework specification for details)
        // 0. implementation can start here, but other classes / methods can be modified or added
        // 1. handle redirects first
        // 2. if not a redirect and file/dir does not exist send back not found
        // 3. if file, serve file
        // 4. if dir, generate page that lists files and dirs contained in dir
        // 5. if markdown, compile and send back html
        if (Object.hasOwn(this.redirectMap, request.path)) {
            response.status(308);
            response.setHeader("Location:", this.redirectMap[request.path]);
        } 
        if (Object.hasOwn(this.redirectMap, request.path) === -1) {
            response.status(404);
            response.send("Page Not Found");
        }


        fs.access(reqPathFull, fs.constants.F_OK, (error) => { // Stack overflow recommendation: access()
            if (error) {
                response.status(404);
                response.setHeader("Content-Type", "text/plain");
                response.send("Page Not Found");
                // response.setHeader("Content-Type", "text/plain");

            } else {
                fs.stat(reqPathFull, (error, stats) => {
                    if (error) {
                        response.status(404);
                        response.setHeader("Content-Type", "text/plain");
                        response.send("Page Not Found");
                        // response.setHeader("Content-Type", "text/plain");

                    } else if (stats.isFile()) {
                        const fileType = getMIMEType(reqPathFull);
                        const fileExtension = getExtension(reqPathFull);

                        if (fileExtension === 'md') {
                            fs.readFile(reqPathFull, (error, data) => {
                                if (error) {
                                    response.status(500);
                                    response.setHeader("Content-Type", "text/plain");
                                    response.send("Internal Server Error");
                                    
                                } else {
                                    const mkContent = MarkdownIt({ html: true });
                                    const render = mkContent.render(data.toString());
                                    response.setHeader("Content-Type", "text/html");
                                    response.send(render);
                                    // response.setHeader("Content-Type", "text/html");

                                }
                            });
                        } else if (fileExtension === 'markdown'){
                            fs.readFile(reqPathFull, (error, data) => {
                                if (error) {
                                    response.status(500);
                                    response.setHeader("Content-Type", "text/plain");
                                    response.send("Internal Server Error");
                                    // response.setHeader("Content-Type", "text/plain");
                                } else {
                                    const mkContent = MarkdownIt({ html: true });
                                    const render = mkContent.render(data.toString());
                                    response.setHeader("Content-Type", "text/html");
                                    response.send(render);
                                    // response.setHeader("Content-Type", "text/html");
                                }
                            });
                        } else {
                            fs.readFile(reqPathFull, (error, data) => {
                                if (error) {
                                    response.status(500);
                                    response.setHeader("Content-Type", "text/plain");
                                    response.send("Internal Server Error");
                                } else {
                                    // console.log(fileType);
                                    response.setHeader("Content-Type", fileType);
                                    response.send(data);
                                    
                                    // console.log(fileType);
                                }
                            });
                        }

                    } else if (stats.isDirectory()) {
                        fs.readdir(reqPathFull, { withFileTypes: true }, (error, piles) => {
                            if (error) {
                                response.status(500);
                                response.setHeader("Content-Type", "text/plain");
                                response.send("Internal Server Error");
                                // response.setHeader("Content-Type", "text/plain");
                            } else {
                                let htmlFile = '<html><body><ul>';
                                piles.map(file => {
                                    let fileLink = `${request.path}${file.name}`;
                                    if (file.isDirectory()) {
                                      fileLink += '/';
                                    }
                                    htmlFile += `<li><a href="${fileLink}">${file.name}${file.isDirectory() ? '/' : ''}</a></li>`;
                                });
                                htmlFile += '</ul></body></html>';
                                response.setHeader("Content-Type","text/html");
                                response.send(htmlFile);
                                
                                // response.setHeader("Content-Type","text/html");
                            }
                        });
                    }
                });
    }});
}}
