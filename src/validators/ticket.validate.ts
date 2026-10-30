import {createTicketInput} from '../types/ticket.type.js';
import {TicketPriority, TicketStatus, TicketFilters} from '../types/ticket.type.js'

type ValidationResult = 
   | {isValid: true, data: createTicketInput}
   | {isValid: false, message: string}

// type TicketValidation =
//   | { isValid: true; data: Record<string, unknown> }
//   | { isValid: false; message: string };


function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateCreateTicket(input: unknown): ValidationResult {
    if(!isObject(input)){
        return {isValid: false, message: "Request body must be a Json object"}
    }


//destructuring an object

const {customerName, phoneNumber, subject, description } = input


 if (
    typeof customerName !== "string" ||
    typeof phoneNumber !== "string" ||
    typeof subject !== "string" ||
    typeof description !== "string"
  ) {
    return {
      isValid: false,
      message: "All ticket fields must be strings",
    };
  }


const cleanedInput: createTicketInput = {
    customerName: customerName.trim(),
    phoneNumber: phoneNumber.trim(),
    subject: subject.trim(),
    description: description.trim(),
};


if (
    !cleanedInput.customerName ||
    !cleanedInput.phoneNumber ||
    !cleanedInput.subject ||
    !cleanedInput.description
) {
    return {
        isValid: false,
        message: "All ticket fields are required",
    };
}

if (
    cleanedInput.customerName.length > 120 ||
    cleanedInput.phoneNumber.length > 15 ||
    cleanedInput.subject.length > 200 ||
    cleanedInput.description.length > 500
) {
    return {
        isValid: false,
        message: "One or more ticket fields exceed maximum length",
    };
}

return {
    isValid: true,
    data: cleanedInput,
};

}


type ValidationResultFilters =
    | {
          isValid: true;
          data: TicketFilters;
      }
    | {
          isValid: false;
          message: string;
      };

const validStatuses: TicketStatus[] = [
    "open",
    "closed",
    "assigned",
    "in-progress",
    "resolved",
];

const validPriorities: TicketPriority[] = [
    "low",
    "medium",
    "high",
    "critical",
];

export function validateTicketFilters(
    searchParams: URLSearchParams,
): ValidationResultFilters {
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const createdAfter = searchParams.get("createdAfter");
    const createdBefore = searchParams.get("createdBefore");

    const customerName = searchParams.get("customerName");
    const phoneNumber = searchParams.get("phoneNumber");
    const subject = searchParams.get("subject");
    const description = searchParams.get("description");

    const pageValue = searchParams.get("page");
    const limitValue = searchParams.get("limit");

    // Validate status
    if (status !== null && !validStatuses.includes(status as TicketStatus)) {
        return {
            isValid: false,
            message: "Invalid ticket status",
        };
    }

    // Validate priority
    if (
        priority !== null &&
        !validPriorities.includes(priority as TicketPriority)
    ) {
        return {
            isValid: false,
            message: "Invalid ticket priority",
        };
    }

    // Validate page
    const page = pageValue === null ? 1 : Number(pageValue);

    if (!Number.isInteger(page) || page < 1) {
        return {
            isValid: false,
            message: "Page must be a positive integer",
        };
    }

    // Validate limit
    const limit = limitValue === null ? 10 : Number(limitValue);

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        return {
            isValid: false,
            message: "Limit must be an integer between 1 and 100",
        };
    }

    // Parse and validate dates
    const afterDate =
        createdAfter !== null ? new Date(createdAfter) : undefined;

    const beforeDate =
        createdBefore !== null ? new Date(createdBefore) : undefined;

    if (afterDate && Number.isNaN(afterDate.getTime())) {
        return {
            isValid: false,
            message: "Invalid createdAfter date",
        };
    }

    if (beforeDate && Number.isNaN(beforeDate.getTime())) {
        return {
            isValid: false,
            message: "Invalid createdBefore date",
        };
    }

    if (afterDate && beforeDate && afterDate > beforeDate) {
        return {
            isValid: false,
            message: "createdAfter must be before or equal to createdBefore",
        };
    }

    const filters: TicketFilters = {
        status: status === null ? undefined : (status as TicketStatus),
        priority: priority === null ? undefined : (priority as TicketPriority),
        createdAfter: afterDate,
        createdBefore: beforeDate,
        customerName: customerName || undefined,
        phoneNumber: phoneNumber || undefined,
        subject: subject || undefined,
        description: description || undefined,
        page,
        limit,
    };

    return {
        isValid: true,
        data: filters,
    };
}

