import { Router } from "express";
import { PublicController } from "../controllers/PublicController";
import { ParkingLotApplication } from "../ParkingLotApplication";

function createPublicRouter(parkingLotApplication: ParkingLotApplication) {
  const router = Router();
  const controller = new PublicController(parkingLotApplication);

  router.get("/", (req, res) => res.send("Welcome to the Parking Lot"));

  router.post("/create_parking_lot", controller.postCreateParkingLot);

  return router;
}

export { createPublicRouter };
