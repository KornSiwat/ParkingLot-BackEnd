import { ParkingLotApplication } from "../ParkingLotApplication";
import { Request, Response } from "express";

class AuthenticatedController {
  readonly parkingLotApplication: ParkingLotApplication;

  constructor(parkingLotApplication: ParkingLotApplication) {
    this.parkingLotApplication = parkingLotApplication;
    this.getStatus = this.getStatus.bind(this);
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

  async getStatus(req: Request, res: Response) {
    const parkingLotId: number = (req as any).user.id;

    try {
      const responseMessage: string = await this.parkingLotApplication.status(
        parkingLotId
      );

      res.json({ result: responseMessage });
    } catch (error) {
      res.status(400).json({ result: error.message });
    }
  }

  async postPark(req: Request, res: Response) {
    const parkingLotId: number = (req as any).user.id;
    const { registrationNumber, colour } = req.body as {
      registrationNumber: string;
      colour: string;
    };

    try {
      const responseMessage = await this.parkingLotApplication.park(
        parkingLotId,
        registrationNumber,
        colour
      );

      res.json({ result: responseMessage });
    } catch (error) {
      console.log(error.message);

      res.status(400).json({ result: error.message });
    }
  }

  async postLeave(req: Request, res: Response) {
    const parkingLotId: number = (req as any).user.id;
    const { slotNumber } = req.body as { slotNumber: number };

    try {
      const responseMessage = await this.parkingLotApplication.leave(
        parkingLotId,
        slotNumber
      );

      res.json({ result: responseMessage });
    } catch (error) {
      console.log(error.message);

      res.status(400).json({ result: error.message });
    }
  }

  async postRegistrationNumbersForCarsWithColour(req: Request, res: Response) {
    const parkingLotId: number = (req as any).user.id;
    const { colour } = req.body as { colour: string };

    try {
      const responseMessage = await this.parkingLotApplication.registrationNumbersForCarsWithColour(
        parkingLotId,
        colour
      );

      res.json({ result: responseMessage });
    } catch (error) {
      res.status(400).json({ result: error.message });
    }
  }

  async postSlotNumbersForCarsWithColour(req: Request, res: Response) {
    const parkingLotId: number = (req as any).user.id;
    const { colour } = req.body as { colour: string };

    try {
      const responseMessage = await this.parkingLotApplication.slotNumbersForCarsWithColour(
        parkingLotId,
        colour
      );

      res.json({ result: responseMessage });
    } catch (error) {
      res.status(400).json({ result: error.message });
    }
  }

  async postSlotNumberForRegistrationNumber(req: Request, res: Response) {
    const parkingLotId: number = (req as any).user.id;
    const { registrationNumber } = req.body as { registrationNumber: string };

    try {
      const responseMessage = await this.parkingLotApplication.slotNumberForRegistrationNumber(
        parkingLotId,
        registrationNumber
      );

      res.json({ result: responseMessage });
    } catch (error) {
      res.status(400).json({ result: error.message });
    }
  }
}

export { AuthenticatedController };
