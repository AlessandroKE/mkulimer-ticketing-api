import {createServer} from 'node:http';
import {createTicketController, handleGetTickets} from './controllers/ticket.controller.js';
import {sendJson} from './http/send-json.js';

export const app = createServer(async (request, response) => {  
    const url = new URL(request.url ?? "/", "http://localhost");
    const pathname = url.pathname;
     try {
    if (request.method === "GET" && pathname === "/health") {
      sendJson(response, 200, { status: "ok" });
      return;
    }

    if (
      request.method === "POST" &&
      pathname === "/api/v1/tickets"
    ) {
      await createTicketController(request, response);
      return;
    }

    if (
      request.method === "GET" &&
      pathname === "/api/v1/tickets"
    ) {
      await handleGetTickets(request, response);
      return;
    }

    sendJson(response, 404, {
      message: "Route not found",
    });
  } catch (error) {
    console.error("Unhandled request error:", error);

    if (!response.headersSent) {
      sendJson(response, 500, {
        message: "Internal server error",
      });
    }
  }
});
