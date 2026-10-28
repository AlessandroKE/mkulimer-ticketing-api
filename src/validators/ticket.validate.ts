import {createTicketInput} from '../types/ticket.type.js';

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



