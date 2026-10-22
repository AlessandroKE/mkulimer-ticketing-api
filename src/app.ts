import {createServer} from 'node:http';
import {createTicketController} from './controllers/ticket.controller.js';
import {sendJson} from './http/send-json.js';

export const app = createServer(async (request, response) => {

    if (request.method === 'GET' && request.url === '/health') {
        sendJson(response, 200, {status: 'ok'});
        return;
    }
    
    if (request.method === 'POST' && request.url === 'api/v1/tickets') {
        await createTicketController(request, response);
        return;
    }
});