import { Ticket } from "./Ticket";
import { VehicleInfo } from "./VehicleInfo";

class TicketManager {
  public tickets: Ticket[];

  constructor() {
    this.tickets = [];
  }

  public issueTicket(slotNumber: number, vehicleInfo: VehicleInfo): Ticket {
    const ticket: Ticket = new Ticket(slotNumber, vehicleInfo);
    this.tickets.push(ticket);
    return ticket;
  }

  public getRegistrationNumbersByColour(colour: string): string[] {
    return this.tickets
      .filter(ticket => ticket.vehicleInfo.colour === colour)
      .map(ticket => ticket.vehicleInfo.registrationNumber);
  }

  public getSlotNumbersByColour(colour: string): number[] {
    return this.tickets
      .filter(ticket => ticket.vehicleInfo.colour === colour)
      .map(ticket => ticket.slotNumber);
  }

  public getSlotNumberByRegistrationNumber(registrationNumber: string): number {
    const ticket: Ticket | undefined = this.tickets.find(
      ticket => ticket.vehicleInfo.registrationNumber === registrationNumber
    );

    if (!ticket) throw new Error("Slot Number Not Found");

    return ticket.slotNumber;
  }

  public getTicketBySlotNumber(slotNumber: number): Ticket {
    const ticket: Ticket | undefined = this.tickets.find(
      ticket => ticket.slotNumber === slotNumber
    );

    if (!ticket) throw new Error("Ticket Not Found");

    return ticket;
  }

  public removeTicket(removingTicket: Ticket): void {
    this.tickets = this.tickets.filter(
      ticket => ticket.slotNumber !== removingTicket.slotNumber
    );
  }
}

export { TicketManager };
