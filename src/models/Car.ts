import { Ticket } from "./Ticket";
import { Entity, PrimaryColumn, Column } from "typeorm";

class Car {
  public _ticket?: Ticket;
  public get ticket() {
    if (!this._ticket) throw new Error("Ticket Not Found");
    
    return this._ticket;
  }
  readonly registrationNumber: string;
  readonly colour: string;

  constructor(registrationNumber: string, colour: string, ticket?: Ticket) {
    this._ticket = ticket;
    this.registrationNumber = registrationNumber;
    this.colour = colour;
  }

  public receiveTicket(ticket: Ticket): void {
    this._ticket = ticket;
  }

  public returnTicket(): Ticket {
    const ticket: Ticket | undefined = this.ticket;
    this._ticket = undefined;

    if (!ticket) throw new Error("Ticket Not Found");

    return ticket;
  }
}

export { Car };
