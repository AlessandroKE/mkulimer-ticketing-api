export type TicketStatus = 
|"open" 
|"closed"
|"assigned"
|"in-progress"
|"resolved"

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
    createdAt: Date;
    updatedAt: Date;
}

export type updateTicketInput = {
    ticketId: string;
    customerName?: string;
    phoneNumber?: string;
    subject?: string;
    description?: string;
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
    createdAt: Date;
    updatedAt: Date;
}