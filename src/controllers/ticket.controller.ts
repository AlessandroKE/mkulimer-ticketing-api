import type { IncomingMessage, ServerResponse } from 'node:http';
import { readJsonBody, PayloadTooLargeError } from '../http/read-json-body.js';
//import {createTicketInput, Ticket} from '../types/ticket.type.js';
import { sendJson } from '../http/send-json.js';
import{validateCreateTicket, validateTicketFilters} from '../validators/ticket.validate.js'
import {createTicket, getTickets} from '../services/tickets.service.js'

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

export async function handleGetTickets(
    request: IncomingMessage,
    response: ServerResponse): Promise<void> {
    try {
        //const tickets = await getAllTicketsService();
        //sendJson(response, 200, { tickets });

        const url = new URL(request.url ?? "/", "http://localhost")

        const validationFilters = validateTicketFilters(url.searchParams)

        if(!validationFilters.isValid){
          sendJson(response, 400, {message: validationFilters.message})
          //dont forget return or the look will keep on running..
          return;
        }

        const ticket = await getTickets(validationFilters.data)
        sendJson(response, 200, {ticket})


    } catch (error) {
        console.error("Failed to retrieve tickets:", error);
        sendJson(response, 500, { error: "Could not retrieve tickets" });
    }
  }