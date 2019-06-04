"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Car {
    get ticket() {
        if (!this._ticket)
            throw new Error("Ticket Not Found");
        return this._ticket;
    }
    constructor(registrationNumber, colour, ticket) {
        this._ticket = ticket;
        this.registrationNumber = registrationNumber;
        this.colour = colour;
    }
    receiveTicket(ticket) {
        this._ticket = ticket;
    }
    returnTicket() {
        const ticket = this.ticket;
        this._ticket = undefined;
        if (!ticket)
            throw new Error("Ticket Not Found");
        return ticket;
    }
}
exports.Car = Car;
