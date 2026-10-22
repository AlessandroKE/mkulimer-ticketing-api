import type { IncomingMessage, ServerResponse } from 'node:http';
import { readJsonBody, PayloadTooLargeError } from '../http/read-json-body.js';
//import {createTicketInput, Ticket} from '../types/ticket.type.js';
import { sendJson } from '../http/send-json.js';
import{validateCreateTicket} from '../validators/ticket.validate.js'
import {createTicket} from '../services/tickets.service.js'

export async function createTicketController(
    request: IncomingMessage,
    response: ServerResponse
): Promise<void> {
 const body = await readJsonBody(request)
 const validation = validateCreateTicket(body)
try {
    if(!validation.isValid){
        sendJson(response, 400, {error: validation.message})
        return;
    }

    const ticket = await createTicket(validation.data)
    sendJson(response, 201, {ticket})

} catch (error) {
    if (error instanceof SyntaxError) {
      sendJson(response, 400, { error: "Request body must be valid JSON" });
      return;
    }

    if (error instanceof PayloadTooLargeError) {
      sendJson(response, 413, { error: "Request body is too large" });
      return;
    }

    console.error("Ticket creation failed:", error);
    sendJson(response, 500, { error: "Could not create ticket" });
  }
}