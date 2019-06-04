"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Slot_1 = require("./Slot");
const TicketManager_1 = require("./TicketManager");
const VehicleInfo_1 = require("./VehicleInfo");
class ParkingLot {
    constructor(slotAmount) {
        this.slotAmount = slotAmount;
        this.slots = this.createSlots(slotAmount);
        this.ticketManager = new TicketManager_1.TicketManager();
    }
    carIn(car) {
        if (this.noAvailableSlot)
            throw new Error("No Available Slot");
        const vehicleInfo = new VehicleInfo_1.VehicleInfo(car.registrationNumber, car.colour);
        const ticket = this.ticketManager.issueTicket(this.nearestAvailableSlot.number, vehicleInfo);
        this.nearestAvailableSlot.allocate();
        car.receiveTicket(ticket);
    }
    carOut(car) {
        const returningTicket = car.returnTicket();
        this.findSlotByNumber(returningTicket.slotNumber).makeAvailable();
        this.ticketManager.removeTicket(returningTicket);
    }
    getTicketBySlotNumber(slotNumber) {
        return this.ticketManager.getTicketBySlotNumber(slotNumber);
    }
    getRegistrationNumbersByColour(colour) {
        return this.ticketManager.getRegistrationNumbersByColour(colour);
    }
    getSlotNumbersByColour(colour) {
        return this.ticketManager.getSlotNumbersByColour(colour);
    }
    getSlotNumberByRegistrationNumber(registrationNumber) {
        return this.ticketManager.getSlotNumberByRegistrationNumber(registrationNumber);
    }
    createSlots(slotAmount) {
        return Array.from(new Array(slotAmount)).map((_, index) => new Slot_1.Slot(index + 1));
    }
    get noAvailableSlot() {
        return this.availableSlots.length === 0;
    }
    get nearestAvailableSlot() {
        return this.availableSlots[0];
    }
    get availableSlots() {
        return this.slots.filter(slot => !slot.isOccupied);
    }
    findSlotByNumber(slotNumber) {
        const slot = this.slots.find(slot => slot.number === slotNumber);
        if (!slot)
            throw new Error("Slot Not Found");
        return slot;
    }
}
exports.ParkingLot = ParkingLot;
