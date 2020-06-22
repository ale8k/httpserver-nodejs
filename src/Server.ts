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
                let testing;
                // Grab request and split headers down into an array
                let decoded = data
                    .toString()
                    .split("\n")
                    .map((str: string) => str.replace(/(\r)|(, br)/g, "").split(":"));
                // The content is always followed by [""], so we know where to split.
                // We also want this content off of the decoded headers
                const payloadIndex = decoded.findIndex((value: string[]) => value[0] === "");
                const payload = decoded.splice(payloadIndex, decoded.length);
                // Grab the method and uri path and format it
                decoded = decoded.concat(
                    decoded
                        .shift()
                        ?.reduce((prev: string, curr: string) => curr)
                        .replace(/( HTTP\/1.1)/, "")
                        .split(" ")
                        .map((val: string, i: number) => (i === 0 ? ["Method", val] : ["URI-Path", val])) as string[][]
                );
                // Turn into objects
                const decodedObjArr = decoded
                    .map((arr: string[]) => arr.map((str: string) => str.trim()))
                    .map((arr: string[]) => {
                        if (arr[0] === "Host") {
                            return ["Host", `${arr[1]}:${arr[2]}`];
                        } else {
                            return arr;
                        }
                    })
                    .map(([key, value]) => {
                        return { [key]: value };
                    });
                // Finalize it into a single object
                let final = {};
                Object.assign(final, ...decodedObjArr);
                console.log(final);
                console.log(payload);
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
