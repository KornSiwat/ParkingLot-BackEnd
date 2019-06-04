import { Router } from "express";
import { Controller } from "./controller";
import { ParkingLotApplication } from "./ParkingLotApplication";

function createRouter() {
  const router = Router();
  const parkingLotApplication: ParkingLotApplication = new ParkingLotApplication();
  const controller: Controller = new Controller(parkingLotApplication);

  router.get("/", (req, res) => res.send("Welcome to the Parking Lot"));

  router.get("/status", controller.getStatus);

  router.post("/create_parking_lot", controller.postCreateParkingLot);

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

export { createRouter };
