import type {ServerResponse} from "node:http";

export async function sendJson(
    response: ServerResponse,
    statusCode: number,
    data: unknown
): Promise<void> 
{
    response.writeHead(statusCode, {
        "Content-Type": "application/json",
    });

    response.end(JSON.stringify(data));
}