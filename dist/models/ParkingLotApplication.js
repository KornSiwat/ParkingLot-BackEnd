"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParkingLot_1 = require("./ParkingLot");
const Car_1 = require("./Car");
class ParkingLotApplication {
    get parkingLot() {
        if (!this._parkingLot)
            throw new Error("Please create parking lot");
        return this._parkingLot;
    }
    createParkingLot(slotAmount) {
        this._parkingLot = new ParkingLot_1.ParkingLot(slotAmount);
        return `Created a parking lot with ${this.parkingLot.slotAmount} slots`;
    }
    park(registrationNumber, colour) {
        const car = new Car_1.Car(registrationNumber, colour);
        try {
            this.parkingLot.carIn(car);
            console.log(`Allocated Slot Number: ${car.ticket.slotNumber}`);
            return `Allocated Slot Number: ${car.ticket.slotNumber}`;
        }
        catch (err) {
            console.log("Sorry, parking lot is full");
            return "Sorry, parking lot is full";
        }
    }
    status() {
        const table = this.statusTable;
        this.renderTable(table);
        return table.join('\n');
    }
    renderTable(table) {
        table.map(row => console.log(row));
    }
    get statusTable() {
        const table = [];
        this.makeStatusTableHeader(table);
        this.makeStatusTableBody(table);
        return table;
    }
    leave(slotNumber) {
        const ticket = this.parkingLot.getTicketBySlotNumber(slotNumber);
        if (!ticket) {
            console.log(`No Car at Slot ${slotNumber}`);
            return `No Car at Slot ${slotNumber}`;
        }
        const car = new Car_1.Car(ticket.vehicleInfo.registrationNumber, ticket.vehicleInfo.colour, ticket);
        this.parkingLot.carOut(car);
        console.log(`Slot number ${slotNumber} is free`);
        return `Slot number ${slotNumber} is free`;
    }
    registrationNumbersForCarsWithColour(colour) {
        const registrationNumbers = this.parkingLot.getRegistrationNumbersByColour(colour);
        if (registrationNumbers.length === 0) {
            console.log("Not Found");
            return "Not Found";
        }
        console.log(registrationNumbers.join(", "));
        return registrationNumbers.join(", ");
    }
    slotNumbersForCarsWithColour(colour) {
        const slotNumbers = this.parkingLot.getSlotNumbersByColour(colour);
        if (slotNumbers.length === 0) {
            console.log("Not Found");
            return "Not Found";
        }
        console.log(slotNumbers.join(", "));
        return slotNumbers.join(", ");
    }
    slotNumberForRegistrationNumber(registrationNumber) {
        try {
            const slotNumber = this.parkingLot.getSlotNumberByRegistrationNumber(registrationNumber);
            console.log(slotNumber.toString());
            return slotNumber.toString();
        }
        catch (_a) {
            console.log("Not Found");
            return "Not Found";
        }
    }
    makeStatusTableHeader(table) {
        const header = "Slot No.  Registration No    Colour";
        table.push(header);
    }
    makeStatusTableBody(table) {
        this.parkingLot.ticketManager.tickets.forEach(ticket => {
            const row = `${ticket.slotNumber}         ${ticket.vehicleInfo.registrationNumber}      ${ticket.vehicleInfo.colour}`;
            table.push(row);
        });
    }
}
exports.ParkingLotApplication = ParkingLotApplication;
