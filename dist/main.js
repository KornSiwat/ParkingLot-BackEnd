"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Router_1 = require("./Router");
const app = express_1.default();
const port = 3000;
app.use(express_1.default.json());
app.use(Router_1.router);
app.listen(port, () => console.log(`Parking lot Application is on port ${port}!`));
