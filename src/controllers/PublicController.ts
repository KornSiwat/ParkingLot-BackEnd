import { ParkingLotApplication } from "../ParkingLotApplication";
import { Request, Response } from "express";

class PublicController {
  readonly parkingLotApplication: ParkingLotApplication;

  constructor(parkingLotApplication: ParkingLotApplication) {
    this.parkingLotApplication = parkingLotApplication;
    this.postCreateParkingLot = this.postCreateParkingLot.bind(this);
  }

  async postCreateParkingLot(req: Request, res: Response) {
    const { slotAmount } = req.body as { slotAmount: number };
    const responseMessage = await this.parkingLotApplication.createParkingLot(
      slotAmount
    );

    res.json({ result: responseMessage });
  }
}

export { PublicController };
