import { pool } from '../db/pool.js';
import { createTicketInput, createTicketOutput, Ticket, TicketFilters } from '../types/ticket.type.js';


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
    filters: TicketFilters,
): Promise<Ticket[]> {
    const conditions: string[] = ["tenant_id = $1"];
    const values: unknown[] = [tenantId];

    function addFilter(column: string, value: unknown): void {
        values.push(value);
        conditions.push(`${column} = $${values.length}`);
    }

    if (filters.status !== undefined) {
        addFilter("status", filters.status);
    }

    if (filters.priority !== undefined) {
        addFilter("priority", filters.priority);
    }

    if (filters.customerName !== undefined) {
        values.push(`%${filters.customerName}%`);
        conditions.push(`customer_name ILIKE $${values.length}`);
    }

    if (filters.phoneNumber !== undefined) {
        values.push(`%${filters.phoneNumber}%`);
        conditions.push(`phone_number ILIKE $${values.length}`);
    }

    if (filters.subject !== undefined) {
        values.push(`%${filters.subject}%`);
        conditions.push(`subject ILIKE $${values.length}`);
    }

    if (filters.description !== undefined) {
        values.push(`%${filters.description}%`);
        conditions.push(`description ILIKE $${values.length}`);
    }

    if (filters.createdAfter !== undefined) {
        values.push(filters.createdAfter);
        conditions.push(`created_at >= $${values.length}`);
    }

    if (filters.createdBefore !== undefined) {
        values.push(filters.createdBefore);
        conditions.push(`created_at <= $${values.length}`);
    }

    const limitPosition = values.push(filters.limit);
    const offset = (filters.page - 1) * filters.limit;
    const offsetPosition = values.push(offset);

    const sql = `
        SELECT
            customer_name AS "customerName",
            phone_number AS "phoneNumber",
            subject,
            description,
            status,
            priority,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        FROM tickets
        WHERE ${conditions.join(" AND ")}
        ORDER BY created_at DESC
        LIMIT $${limitPosition}
        OFFSET $${offsetPosition}
    `;

    const result = await pool.query<Ticket>(sql, values);

    return result.rows;
}