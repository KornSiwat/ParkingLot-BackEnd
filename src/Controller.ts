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
    this.postRegistrationNumbersForCarsWithColour = this.postRegistrationNumbersForCarsWithColour.bind(
      this
    );
    this.postSlotNumbersForCarsWithColour = this.postSlotNumbersForCarsWithColour.bind(
      this
    );
    this.postSlotNumberForRegistrationNumber = this.postSlotNumberForRegistrationNumber.bind(
      this
    );
  }

  getStatus(req: Request, res: Response) {
    const parkingLotId: number = req.params.parkingLotId;
    res.send(this.parkingLotApplication.status(parkingLotId));
  }

  async postCreateParkingLot(req: Request, res: Response) {
    const { slotAmount } = req.body as { slotAmount: number };
    const responseMessage = await this.parkingLotApplication.createParkingLot(
      slotAmount
    );

    res.send(responseMessage);
  }

  async postPark(req: Request, res: Response) {
    const parkingLotId: number = req.params.parkingLotId;
    const { registrationNumber, colour } = req.body as {
      registrationNumber: string;
      colour: string;
    };
    const responseMessage = await this.parkingLotApplication.park(
      parkingLotId,
      registrationNumber,
      colour
    );

    res.send(responseMessage);
  }

  async postLeave(req: Request, res: Response) {
    const parkingLotId: number = req.params.parkingLotId;
    const { slotNumber } = req.body as { slotNumber: number };
    const responseMessage = await this.parkingLotApplication.leave(
      parkingLotId,
      slotNumber
    );

    res.send(responseMessage);
  }

  async postRegistrationNumbersForCarsWithColour(req: Request, res: Response) {
    const parkingLotId: number = req.params.parkingLotId;
    const { colour } = req.body as { colour: string };
    const responseMessage = await this.parkingLotApplication.registrationNumbersForCarsWithColour(
      parkingLotId,
      colour
    );

    res.send(responseMessage);
  }

  async postSlotNumbersForCarsWithColour(req: Request, res: Response) {
    const parkingLotId: number = req.params.parkingLotId;
    const { colour } = req.body as { colour: string };
    const responseMessage = await this.parkingLotApplication.slotNumbersForCarsWithColour(
      parkingLotId,
      colour
    );

    res.send(responseMessage);
  }

  async postSlotNumberForRegistrationNumber(req: Request, res: Response) {
    const parkingLotId: number = req.params.parkingLotId;
    const { registrationNumber } = req.body as { registrationNumber: string };
    const responseMessage = await this.parkingLotApplication.slotNumberForRegistrationNumber(
      parkingLotId,
      registrationNumber
    );

    res.send(responseMessage);
  }
}

export { Controller };
