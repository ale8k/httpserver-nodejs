import { Server, Socket } from "net";

/**
 * Supports only HTTP 1.1
 *
 * @author ale8k
 */
class ServerWrapper {
    private _server: Server;

    constructor() {
        this._server = new Server();
        this._server.on("connection", (socket: Socket) => {
            socket.on("data", (data: Buffer) => {

                
            });
        });
    }

    public start(): void {
        this._server.listen(3001, () => {
            console.log("Server listening on 3001");
        });
    }
}

new ServerWrapper().start();

/**
 * Ideas for creating instances:
 * 
 * let server = new ServerWrapper(port, host?, options?);
 * 
 * server.addRoute({
 *  route: string;
 *  method: string;
 *  controller: controllerReference;
 * });
 * 
 * or:
 * 
 * import { Router } from "blahblahblah";
 * Router.get("endpoint/here", controllerReference);
 * Router.etc...
 * 
 * class Controller {
 * ???????????????????????????????????????????????????
 * }
 */
