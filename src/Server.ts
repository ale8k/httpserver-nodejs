import net, { Server, Socket } from "net";

class ServerWrapper {
    private _server: Server;

    constructor() {
        this._server = new Server();
        this._server.on("connection", (socket: Socket) => {
            socket.on("data", (data) => {
                // Grab request and split headers down into an array
                let decoded = data.toString().split("\n");
                // Parse into nested array for object prep
                let headersPreParse = decoded.map(str => {
                    return str.replace(/(\r)|(, br)/g, "").split(":");
                });
                // TODO: Handle other HTTP versions
                let methodAndEndpoint = headersPreParse[0][0]
                    .replace(/( HTTP\/1.1)/, "")
                    .split(" ");

                // Find content type
                // Find content length
                // Parse content (body) out of headersPreParse
                // Complete header object
                

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