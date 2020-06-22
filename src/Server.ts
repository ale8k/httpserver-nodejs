import net, { Server, Socket } from "net";
import { cursorTo } from "readline";

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
            socket.on("data", (data) => {
                // Grab request and split headers down into an array
                let decoded = data
                    .toString()
                    .split("\n")
                    .map((str) => str.replace(/(\r)|(, br)/g, "").split(":"));
                // The content is always followed by [""], so we know where to split.
                // We also want this content off of the decoded headers
                const payloadIndex = decoded.findIndex((value) => value[0] === "");
                const payload = decoded.splice(payloadIndex, decoded.length);
                // Grab the method and uri path and format it
                decoded = decoded.concat(
                    decoded
                        .shift()
                        ?.reduce((prev, curr) => curr)
                        .replace(/( HTTP\/1.1)/, "")
                        .split(" ")
                        .map((val, i) => (i === 0 ? ["Method", val] : ["URI-Path", val])) as string[][]
                );
                console.log(decoded, "final");
                // Now we need to reduce any nested array with more than 2 elements,
                // as elements > 1 are a single value for this header
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
