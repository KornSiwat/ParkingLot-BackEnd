import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { createPublicRouter } from "./routers/PublicRouter";
import { createAuthenticatedRouter} from "./routers/AuthenticatedRouter";
import { ParkingLotApplication } from "./ParkingLotApplication";

createConnection().then(connection => {
  const app = express();
  const port = 3000;
  const parkingLotApplication = new ParkingLotApplication();
  const publicRouter = createPublicRouter(parkingLotApplication);
  const authenticatedRouter = createAuthenticatedRouter(parkingLotApplication);

  app.use(express.json());

  app.use(publicRouter);
  app.use(authenticatedRouter);

  app.listen(port, () =>
    console.log(`Parking lot Application is on port ${port}!`)
  );
});
