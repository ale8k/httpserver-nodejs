/**
 * Static helper class responsible for parsing the incoming
 * http formatted ISO-8859-1 encoded data
 * 
 * @class
 * @author ale8k
 */
export default class HttpParser {
    /**
     * 
     * @param data 
     */
    public static parse(data: Buffer) {
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
    }
}