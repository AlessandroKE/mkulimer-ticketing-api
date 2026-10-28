import { pool } from '../db/pool.js';
import { createTicketInput, createTicketOutput, Ticket } from '../types/ticket.type.js';


// create Ticket
export async function insertTicket(
    tenantId: string,
    ticketData: createTicketInput
): Promise<Ticket> {
    const result = await pool.query<Ticket>(
        `INSERT into tickets
        (tenant_id, customer_name, phone_number, subject, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING
      id,
      tenant_id AS "tenantId",
      customer_name AS "customerName",
      phone_number AS "phoneNumber",
      subject,
      description,
      status,
      created_at AS "createdAt",
      updated_at AS "updatedAt"`,
        [
            tenantId,
            ticketData.customerName,
            ticketData.phoneNumber,
            ticketData.subject,
            ticketData.description,
        ],
    );

    const ticket = result.rows[0];
    if (!ticket) {
        throw new Error('Failed to insert ticket');
    }
    return ticket;
}

// Get all tickets for a specific tenant
export async function getAllTickets(
    tenantId: string,
): Promise<createTicketOutput[]> {
    const result = await pool.query<createTicketOutput>(
        `SELECT
       ticket_id AS "ticketId",
       customer_name AS "customerName",
       phone_number AS "phoneNumber",
       subject,
       description,
       status,
       created_at AS "createdAt",
       updated_at AS "updatedAt"
     FROM tickets
     WHERE tenant_id = $1
     ORDER BY created_at DESC`,
        [tenantId],
    );
    const tickets = result.rows;
    if (tickets == null || tickets.length === 0) {
        throw new Error('Failed to retrieve tickets');
    }
    return tickets;
}

// 