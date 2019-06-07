import { Router } from "express";
import { AuthenticatedController } from "../controllers/AuthenticatedController";
import { ParkingLotApplication } from "../ParkingLotApplication";
import jwt from "express-jwt";
import { Config } from "../Config";

function createAuthenticatedRouter(parkingLotApplication: ParkingLotApplication) {
  const router = Router();
  const controller = new AuthenticatedController(parkingLotApplication);
  const secretKey = Config.secretKey;

  router.use(jwt({ secret: secretKey }));

  router.get("/status", controller.getStatus);

  router.post("/park", controller.postPark);

  router.post("/leave", controller.postLeave);

  router.post(
    "/registration_numbers_for_cars_with_colour",
    controller.postRegistrationNumbersForCarsWithColour
  );

  router.post(
    "/slot_numbers_for_cars_with_colour",
    controller.postSlotNumbersForCarsWithColour
  );

  router.post(
    "/slot_number_for_registration_number",
    controller.postSlotNumberForRegistrationNumber
  );

  return router;
}

export { createAuthenticatedRouter };
