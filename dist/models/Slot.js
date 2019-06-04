"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Slot {
    constructor(slotNumber) {
        this.number = slotNumber;
        this.isOccupied = false;
    }
    makeAvailable() {
        this.isOccupied = false;
    }
    allocate() {
        this.isOccupied = true;
    }
}
exports.Slot = Slot;
