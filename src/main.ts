import express from "express";
import { createRouter } from "./Router";
import "reflect-metadata";
import { createConnection } from "typeorm";

createConnection().then(connection => {
  const app = express();
  const port = 3000;
  const router = createRouter()

  app.use(express.json());

  app.use(router);

  app.listen(port, () =>
    console.log(`Parking lot Application is on port ${port}!`)
  );
});
