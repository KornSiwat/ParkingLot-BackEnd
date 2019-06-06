import { Car } from "./Car";
import { Slot } from "./Slot";
import { VehicleInfo } from "./VehicleInfo";
import { Ticket } from "./Ticket";
import { Entity, PrimaryColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("parkingLots")
class ParkingLot {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToMany(type => Slot, slot => slot.parkingLot, {
    cascade: true,
    eager: true
  })
  public slots: Slot[];

  @OneToMany(type => Ticket, ticket => ticket.parkingLot, {
    cascade: true,
    eager: true
  })
  public _tickets: Ticket[];

  public get tickets() {
    return this._tickets.sort((a, b) => a.slotNumber - b.slotNumber);
  }

  public createSlots(slotAmount: number): Slot[] {
    return Array.from(new Array(slotAmount)).map(
      (_, index) => new Slot(index + 1)
    );
  }

  public carIn(car: Car): void {
    if (this.noAvailableSlot) throw new Error("No Available Slot");

    const vehicleInfo: VehicleInfo = new VehicleInfo(
      car.registrationNumber,
      car.colour
    );
    const ticket: Ticket = this.issueTicket(
      this.id,
      this.nearestAvailableSlot.number,
      vehicleInfo
    );

    this.nearestAvailableSlot.allocate();

    car.receiveTicket(ticket);
  }

  public carOut(car: Car): void {
    const returningTicket: Ticket = car.returnTicket();

    this.findSlotByNumber(returningTicket.slotNumber).makeAvailable();

    this.removeTicket(returningTicket);
  }

  public getTicketBySlotNumber(slotNumber: number): Ticket {
    const ticket: Ticket | undefined = this.tickets.find(
      ticket => ticket.slotNumber === slotNumber
    );

    if (!ticket) throw new Error("Ticket Not Found");

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

  private get noAvailableSlot(): boolean {
    return this.availableSlots.length === 0;
  }

  private get nearestAvailableSlot(): Slot {
    return this.availableSlots[0];
  }

  private get availableSlots(): Slot[] {
    return this.slots.filter(slot => !slot.isOccupied);
  }

  private findSlotByNumber(slotNumber: number): Slot {
    const slot = this.slots.find(slot => slot.number === slotNumber);

    if (!slot) throw new Error("Slot Not Found");

    return slot;
  }

  private issueTicket(
    parkingLotId: number,
    slotNumber: number,
    vehicleInfo: VehicleInfo
  ): Ticket {
    const ticket: Ticket = new Ticket(parkingLotId, slotNumber, vehicleInfo);

    this._tickets.push(ticket);

    return ticket;
  }

  private removeTicket(removingTicket: Ticket): void {
    this._tickets = this.tickets.filter(
      ticket => ticket.slotNumber !== removingTicket.slotNumber
    );
  }
}

export { ParkingLot };
