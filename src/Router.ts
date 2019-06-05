import { Router } from "express";
import { Controller } from "./controller";
import { ParkingLotApplication } from "./ParkingLotApplication";

function createRouter() {
  const router = Router();
  const parkingLotApplication: ParkingLotApplication = new ParkingLotApplication();
  const controller: Controller = new Controller(parkingLotApplication);

  router.get("/", (req, res) => res.send("Welcome to the Parking Lot"));

  router.get("/:parkingLotId/status", controller.getStatus);

  router.post("/create_parking_lot", controller.postCreateParkingLot);

  router.post("/:parkingLotId/park", controller.postPark);

  router.post("/:parkingLotId/leave", controller.postLeave);

  router.post(
    "/:parkingLotId/registration_numbers_for_cars_with_colour",
    controller.postRegistrationNumbersForCarsWithColour
  );

  router.post(
    "/:parkingLotId/slot_numbers_for_cars_with_colour",
    controller.postSlotNumbersForCarsWithColour
  );

  router.post(
    "/:parkingLotId/slot_number_for_registration_number",
    controller.postSlotNumberForRegistrationNumber
  );

  return router;
}

export { createRouter };
