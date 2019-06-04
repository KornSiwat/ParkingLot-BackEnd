import { ParkingLot } from "./models/ParkingLot";
import { Car } from "./models/Car";
import { Ticket } from "./models/Ticket";
import { getConnection } from "typeorm";
import { Slot } from "./models/Slot";

class ParkingLotApplication {
  private _parkingLot?: ParkingLot;
  private get parkingLot(): ParkingLot {
    if (!this._parkingLot) throw new Error("Please create parking lot");

    return this._parkingLot;
  }

  constructor() {
    this.setup();
  }

  public async setup(): Promise<void> {
    const slots = await this.getSlots();
    const slotAmount = slots.length;
    const tickets = await this.getTickets();

    if (slotAmount !== 0) {
      this._parkingLot = new ParkingLot(slotAmount);
      this.parkingLot.slots = slots;
      this.parkingLot.ticketManager.tickets = tickets;
    }
    return;
  }

  public async createParkingLot(slotAmount: number): Promise<string> {
    this._parkingLot = new ParkingLot(slotAmount);
    const slots = this.parkingLot.slots;
    const connection = getConnection();
    const repository = connection.getRepository(Slot);

    await repository.save(slots);

    return `Created a parking lot with ${this.parkingLot.slotAmount} slots`;
  }

  public async park(
    registrationNumber: string,
    colour: string
  ): Promise<string> {
    const car: Car = new Car(registrationNumber, colour);

    try {
      this.parkingLot.carIn(car);

      this.syncParkingLot();

      console.log(`Allocated Slot Number: ${car.ticket.slotNumber}`);

      return `Allocated Slot Number: ${car.ticket.slotNumber}`;
    } catch (err) {
      console.log("Sorry, parking lot is full");

      return "Sorry, parking lot is full";
    }
  }

  public status(): string {
    const table: string[] = this.statusTable;

    this.renderTable(table);

    return table.join("\n");
  }

  private renderTable(table: string[]): void {
    table.map(row => console.log(row));
  }

  private get statusTable(): string[] {
    const table: string[] = [];

    this.makeStatusTableHeader(table);
    this.makeStatusTableBody(table);

    return table;
  }

  public async leave(slotNumber: number): Promise<string> {
    const ticket: Ticket | undefined = this.parkingLot.getTicketBySlotNumber(
      slotNumber
    );

    if (!ticket) {
      console.log(`No Car at Slot ${slotNumber}`);

      return `No Car at Slot ${slotNumber}`;
    }

    const car = new Car(
      ticket.vehicleInfo.registrationNumber,
      ticket.vehicleInfo.colour,
      ticket
    );

    this.parkingLot.carOut(car);

    this.syncParkingLot();

    console.log(`Slot number ${slotNumber} is free`);

    return `Slot number ${slotNumber} is free`;
  }

  public registrationNumbersForCarsWithColour(colour: string): string {
    const registrationNumbers: string[] = this.parkingLot.getRegistrationNumbersByColour(
      colour
    );

    if (registrationNumbers.length === 0) {
      console.log("Not Found");

      return "Not Found";
    }
    console.log(registrationNumbers.join(", "));

    return registrationNumbers.join(", ");
  }

  public slotNumbersForCarsWithColour(colour: string): string {
    const slotNumbers = this.parkingLot.getSlotNumbersByColour(colour);

    if (slotNumbers.length === 0) {
      console.log("Not Found");

      return "Not Found";
    }
    console.log(slotNumbers.join(", "));

    return slotNumbers.join(", ");
  }

  public slotNumberForRegistrationNumber(registrationNumber: string): string {
    try {
      const slotNumber = this.parkingLot.getSlotNumberByRegistrationNumber(
        registrationNumber
      );

      console.log(slotNumber.toString());

      return slotNumber.toString();
    } catch {
      console.log("Not Found");

      return "Not Found";
    }
  }

  private makeStatusTableHeader(table: string[]): void {
    const header: string = "Slot No.  Registration No    Colour";

    table.push(header);
  }

  private makeStatusTableBody(table: string[]): void {
    this.parkingLot.ticketManager.tickets.forEach(ticket => {
      const row = `${ticket.slotNumber}         ${
        ticket.vehicleInfo.registrationNumber
      }      ${ticket.vehicleInfo.colour}`;

      table.push(row);
    });
  }

  private async getSlots(): Promise<Slot[]> {
    const connection = getConnection();
    const slotRepository = connection.getRepository(Slot);

    return await slotRepository.find({ order: { number: "ASC" } });
  }

  private async getTickets(): Promise<Ticket[]> {
    const connection = getConnection();
    const ticketRepository = connection.getRepository(Ticket);

    return await ticketRepository.find();
  }

  private async syncParkingLot(): Promise<void> {
    await this.syncSlots();
    await this.syncTickets();
  }

  private async syncSlots(): Promise<void> {
    const connection = getConnection();
    const slotRepository = connection.getRepository(Slot);
    const slots = this.parkingLot.slots;

    await slotRepository.save(slots);
  }

  private async syncTickets(): Promise<void> {
    const connection = getConnection();
    const ticketRepository = connection.getRepository(Slot);
    const tickets = this.parkingLot.slots;

    await ticketRepository.save(tickets);
  }
}

export { ParkingLotApplication };
