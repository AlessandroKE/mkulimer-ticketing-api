import {createTicketInput, createTicketOutput, Ticket,  TicketFilters} from '../types/ticket.type.js'
import {insertTicket, getAllTickets} from '../repositories/tickets.repository.js'

const tenantId = process.env.TENANT_ID;

function getTenantId(): string {
    if (!tenantId) {
        throw new Error(
            "Tenant ID is not defined in environment variables",
        );
    }

    return tenantId;
}

export async function createTicket(input: createTicketInput) {

    if (!tenantId) {
        throw new Error('Tenant ID is not defined in environment variables');
    }

    return await insertTicket(getTenantId(), input);
}

export async function getTickets(
    filters: TicketFilters,
): Promise<Ticket[]> {

    const tickets = await getAllTickets(getTenantId(), filters);

    return tickets;
}