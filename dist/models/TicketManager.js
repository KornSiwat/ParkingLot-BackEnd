"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ticket_1 = require("./Ticket");
class TicketManager {
    constructor() {
        this.tickets = [];
    }
    issueTicket(slotNumber, vehicleInfo) {
        const ticket = new Ticket_1.Ticket(slotNumber, vehicleInfo);
        this.tickets.push(ticket);
        return ticket;
    }
    getRegistrationNumbersByColour(colour) {
        return this.tickets
            .filter(ticket => ticket.vehicleInfo.colour === colour)
            .map(ticket => ticket.vehicleInfo.registrationNumber);
    }
    getSlotNumbersByColour(colour) {
        return this.tickets
            .filter(ticket => ticket.vehicleInfo.colour === colour)
            .map(ticket => ticket.slotNumber);
    }
    getSlotNumberByRegistrationNumber(registrationNumber) {
        const ticket = this.tickets.find(ticket => ticket.vehicleInfo.registrationNumber === registrationNumber);
        if (!ticket)
            throw new Error("Slot Number Not Found");
        return ticket.slotNumber;
    }
    getTicketBySlotNumber(slotNumber) {
        const ticket = this.tickets.find(ticket => ticket.slotNumber === slotNumber);
        if (!ticket)
            throw new Error("Ticket Not Found");
        return ticket;
    }
    removeTicket(removingTicket) {
        this.tickets = this.tickets.filter(ticket => ticket.slotNumber !== removingTicket.slotNumber);
    }
}
exports.TicketManager = TicketManager;
