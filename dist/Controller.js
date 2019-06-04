"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    constructor(parkingLotApplication) {
        this.parkingLotApplication = parkingLotApplication;
        this.getStatus = this.getStatus.bind(this);
        this.postCreateParkingLot = this.postCreateParkingLot.bind(this);
        this.postPark = this.postPark.bind(this);
        this.postLeave = this.postLeave.bind(this);
        this.postRegistrationNumbersForCarsWithColour = this.postRegistrationNumbersForCarsWithColour.bind(this);
        this.postSlotNumbersForCarsWithColour = this.postSlotNumbersForCarsWithColour.bind(this);
        this.postSlotNumberForRegistrationNumber = this.postSlotNumberForRegistrationNumber.bind(this);
    }
    getStatus(req, res) {
        res.send(this.parkingLotApplication.status());
    }
    postCreateParkingLot(req, res) {
        const { slotAmount } = req.body;
        const responseMessage = this.parkingLotApplication.createParkingLot(slotAmount);
        res.send(responseMessage);
    }
    postPark(req, res) {
        const { registrationNumber, colour } = req.body;
        const responseMessage = this.parkingLotApplication.park(registrationNumber, colour);
        res.send(responseMessage);
    }
    postLeave(req, res) {
        const { slotNumber } = req.body;
        const responseMessage = this.parkingLotApplication.leave(slotNumber);
        res.send(responseMessage);
    }
    postRegistrationNumbersForCarsWithColour(req, res) {
        const { colour } = req.body;
        const responseMessage = this.parkingLotApplication.registrationNumbersForCarsWithColour(colour);
        res.send(responseMessage);
    }
    postSlotNumbersForCarsWithColour(req, res) {
        const { colour } = req.body;
        const responseMessage = this.parkingLotApplication.slotNumbersForCarsWithColour(colour);
        res.send(responseMessage);
    }
    postSlotNumberForRegistrationNumber(req, res) {
        const { registrationNumber } = req.body;
        const responseMessage = this.parkingLotApplication.slotNumberForRegistrationNumber(registrationNumber);
        res.send(responseMessage);
    }
}
exports.Controller = Controller;
