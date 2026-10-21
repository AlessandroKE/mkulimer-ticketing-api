import type { IncomingMessage } from "node:http";

export class PayloadTooLargeError extends Error {}


export async function readJsonBody(request: IncomingMessage): Promise<unknown> {
    const chunks: Buffer[] = [];
    let totalSize = 0;
    const maxSize = 1 * 1024 * 1024; // 1MB

    for await (const chunk of request) {
        totalSize += chunk.length;
        if (totalSize > maxSize) {
            throw new PayloadTooLargeError("Request body too large");
        }
        chunks.push(chunk);
    }

    const body = Buffer.concat(chunks).toString("utf-8");
    return JSON.parse(body);
}
