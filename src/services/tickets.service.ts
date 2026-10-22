import {createTicketInput} from '../types/ticket.type.js'
import {insertTicket} from '../repositories/tickets.repository.js'

export async function createTicket(input: createTicketInput) {
    const tenantId = process.env.TENANT_ID;
    if (!tenantId) {
        throw new Error('Tenant ID is not defined in environment variables');
    }

    return await insertTicket(tenantId, input);
}