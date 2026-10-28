export type TicketStatus = 
|"open" 
|"closed"
|"assigned"
|"in-progress"
|"resolved"

export type TicketPriority = 
|"low"
|"medium"
|"high"
|"critical";

export type createTicketInput = {
    customerName: string;
    phoneNumber: string;
    subject: string;
    description: string;
};

export type createTicketOutput = {
    ticketId: string;
    customerName: string;
    phoneNumber: string;
    subject: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt: Date;
    updatedAt: Date;
}

export type updateTicketInput = {
    ticketId: string;
    customerName?: string;
    phoneNumber?: string;
    subject?: string;
    description?: string;
    priority?: TicketPriority;
    status?: TicketStatus;
}

export type Ticket = {
    id: string;
    tenantId: string;
    customerName: string;
    phoneNumber: string;
    subject: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt: Date;
    updatedAt: Date;
}

export interface TicketFilters {
    status?: TicketStatus;
    priority?: TicketPriority;
    createdAfter?: Date;
    createdBefore?: Date;
    customerName?: string;
    phoneNumber?: string;
    subject?: string;
    description?: string;
    page: number;
    limit: number;
}