import { Car } from "./Car";
import { Slot } from "./Slot";
import { TicketManager } from "./TicketManager";
import { VehicleInfo } from "./VehicleInfo";
import { Ticket } from "./Ticket";
import { Entity, PrimaryColumn, OneToMany } from "typeorm";

@Entity("parkingLots")
class ParkingLot {
  @PrimaryColumn()
  readonly id: number;
  readonly ticketManager: TicketManager;
  @OneToMany(type => Slot, slot => slot.parkingLot)
  public slots: Slot[];

  constructor(id: number) {
    this.id = id;
    this.ticketManager = new TicketManager();
  }

  public createSlots(slotAmount: number): Slot[] {
    return Array.from(new Array(slotAmount)).map(
      (_, index) => new Slot(index + 1, this)
    );
  }

  public carIn(car: Car): void {
    if (this.noAvailableSlot) throw new Error("No Available Slot");

    const vehicleInfo: VehicleInfo = new VehicleInfo(
      car.registrationNumber,
      car.colour
    );
    const ticket: Ticket = this.ticketManager.issueTicket(
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

    this.ticketManager.removeTicket(returningTicket);
  }

  public getTicketBySlotNumber(slotNumber: number): Ticket {
    return this.ticketManager.getTicketBySlotNumber(slotNumber);
  }

  public getRegistrationNumbersByColour(colour: string): string[] {
    return this.ticketManager.getRegistrationNumbersByColour(colour);
  }

  public getSlotNumbersByColour(colour: string): number[] {
    return this.ticketManager.getSlotNumbersByColour(colour);
  }

  public getSlotNumberByRegistrationNumber(registrationNumber: string): number {
    return this.ticketManager.getSlotNumberByRegistrationNumber(
      registrationNumber
    );
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
}

export { ParkingLot };
