import { ParkingLotApplication } from "./ParkingLotApplication";
import { Request, Response } from "express";

class Controller {
  readonly parkingLotApplication: ParkingLotApplication;

  constructor(parkingLotApplication: ParkingLotApplication) {
    this.parkingLotApplication = parkingLotApplication;
    this.getStatus = this.getStatus.bind(this);
    this.postCreateParkingLot = this.postCreateParkingLot.bind(this);
    this.postPark = this.postPark.bind(this);
    this.postLeave = this.postLeave.bind(this);
    this.postRegistrationNumbersForCarsWithColour = this.postRegistrationNumbersForCarsWithColour.bind(this);
    this.postSlotNumbersForCarsWithColour = this.postSlotNumbersForCarsWithColour.bind(this);
    this.postSlotNumberForRegistrationNumber = this.postSlotNumberForRegistrationNumber.bind(this);
  }

  getStatus(req: Request, res: Response) {
    res.send(this.parkingLotApplication.status());
  }

  async postCreateParkingLot(req: Request, res: Response) {
    const { slotAmount } = req.body as { slotAmount: number };
    const responseMessage =  await this.parkingLotApplication.createParkingLot(
      slotAmount
    );

    res.send(responseMessage);
  }

  async postPark(req: Request, res: Response) {
    const { registrationNumber, colour } = req.body as {
      registrationNumber: string;
      colour: string;
    };
    const responseMessage = await this.parkingLotApplication.park(
      registrationNumber,
      colour
    );

    res.send(responseMessage);
  }

  async postLeave(req: Request, res: Response) {
    const { slotNumber } = req.body as { slotNumber: number };
    const responseMessage = await this.parkingLotApplication.leave(slotNumber);

    res.send(responseMessage);
  }

  postRegistrationNumbersForCarsWithColour(req: Request, res: Response) {
    const { colour } = req.body as { colour: string };
    const responseMessage = this.parkingLotApplication.registrationNumbersForCarsWithColour(
      colour
    );

    res.send(responseMessage);
  }

  postSlotNumbersForCarsWithColour(req: Request, res: Response) {
    const { colour } = req.body as { colour: string };
    const responseMessage = this.parkingLotApplication.slotNumbersForCarsWithColour(
      colour
    );

    res.send(responseMessage);
  }

  postSlotNumberForRegistrationNumber(req: Request, res: Response) {
    const { registrationNumber } = req.body as { registrationNumber: string };
    const responseMessage = this.parkingLotApplication.slotNumberForRegistrationNumber(
      registrationNumber
    );

    res.send(responseMessage);
  }
}

export { Controller };
