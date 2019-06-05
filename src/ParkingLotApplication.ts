import { ParkingLot } from "./models/ParkingLot";
import { Car } from "./models/Car";
import { Ticket } from "./models/Ticket";
import { getConnection } from "typeorm";
import { Slot } from "./models/Slot";

class ParkingLotApplication {
  private parkingLots: ParkingLot[];
  private getParkingLot(parkingLotId: number): ParkingLot {
    try {
      const parkingLotIndex: number = parkingLotId - 1;

      return this.parkingLots[parkingLotIndex];
    } catch {
      throw new Error(`Parking Lot With Id ${parkingLotId} Not Found`);
    }
  }

  constructor() {
    this.setupParkingLot();
  }

  public async setupParkingLot(): Promise<void> {
    this.parkingLots = await this.getParkingLots();
    this.parkingLots.forEach(async parkingLot => {
      const parkingLotId = parkingLot.id;
      parkingLot.slots = await this.getSlotsOfParkingLotWithId(parkingLotId);
      parkingLot.ticketManager._tickets = await this.getTicketsOfParkingLotWithId(
        parkingLotId
      );
    });
  }

  public async createParkingLot(slotAmount: number): Promise<string> {
    const totalParkingLotAmount = this.parkingLots.length;
    const newParkingLotId = totalParkingLotAmount + 1;
    const newParkingLot = new ParkingLot(newParkingLotId);
    const slots = newParkingLot.createSlots(slotAmount);

    newParkingLot.slots = slots;

    this.parkingLots.push(newParkingLot);

    this.syncParkingLotsDataToDatabase();

    return `Created a parking lot id: ${newParkingLot.id} with ${
      newParkingLot.slots.length
    } slots`;
  }

  public async park(
    parkingLotId: number,
    registrationNumber: string,
    colour: string
  ): Promise<string> {
    const car: Car = new Car(registrationNumber, colour);

    try {
      const parkingLot = this.getParkingLot(parkingLotId);

      parkingLot.carIn(car);

      this.syncParkingLotsDataToDatabase();

      console.log(`Allocated Slot Number: ${car.ticket.slotNumber}`);

      return `Allocated Slot Number: ${car.ticket.slotNumber}`;
    } catch (err) {
      console.log("Sorry, parking lot is full");

      return "Sorry, parking lot is full";
    }
  }

  public status(parkingLotId: number): string {
    const table: string[] = this.getStatusTable(parkingLotId);

    this.renderTable(table);

    return table.join("\n");
  }

  private renderTable(table: string[]): void {
    table.map(row => console.log(row));
  }

  private getStatusTable(parkingLotId: number): string[] {
    const table: string[] = [];

    this.makeStatusTableHeader(table);
    this.makeStatusTableBody(parkingLotId, table);

    return table;
  }

  public async leave(
    parkingLotId: number,
    slotNumber: number
  ): Promise<string> {
    const parkingLot = this.getParkingLot(parkingLotId);
    const ticket: Ticket | undefined = parkingLot.getTicketBySlotNumber(
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

    parkingLot.carOut(car);

    this.syncParkingLotsDataToDatabase();

    console.log(`Slot number ${slotNumber} is free`);

    return `Slot number ${slotNumber} is free`;
  }

  public async registrationNumbersForCarsWithColour(
    parkingLotId: number,
    colour: string
  ): Promise<string> {
    const parkingLot = this.getParkingLot(parkingLotId);
    const registrationNumbers: string[] = parkingLot.getRegistrationNumbersByColour(
      colour
    );

    if (registrationNumbers.length === 0) {
      console.log("Not Found");

      return "Not Found";
    }
    console.log(registrationNumbers.join(", "));

    return registrationNumbers.join(", ");
  }

  public async slotNumbersForCarsWithColour(
    parkingLotId: number,
    colour: string
  ): Promise<string> {
    const parkingLot = this.getParkingLot(parkingLotId);
    const slotNumbers = parkingLot.getSlotNumbersByColour(colour);

    if (slotNumbers.length === 0) {
      console.log("Not Found");

      return "Not Found";
    }
    console.log(slotNumbers.join(", "));

    return slotNumbers.join(", ");
  }

  public async slotNumberForRegistrationNumber(
    parkingLotId: number,
    registrationNumber: string
  ): Promise<string> {
    try {
      const parkingLot = this.getParkingLot(parkingLotId);
      const slotNumber = parkingLot.getSlotNumberByRegistrationNumber(
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

  private async makeStatusTableBody(
    parkingLotId: number,
    table: string[]
  ): Promise<void> {
    const parkingLot = this.getParkingLot(parkingLotId);
    parkingLot.ticketManager.tickets.forEach(ticket => {
      const row = `${ticket.slotNumber}         ${
        ticket.vehicleInfo.registrationNumber
      }      ${ticket.vehicleInfo.colour}`;

      table.push(row);
    });
  }

  private async getParkingLots(): Promise<ParkingLot[]> {
    const connection = getConnection();
    const parkingLotRepository = connection.getRepository(ParkingLot);

    return await parkingLotRepository.find();
  }

  private async getSlotsOfParkingLotWithId(
    parkingLotId: number
  ): Promise<Slot[]> {
    const connection = getConnection();
    const slotRepository = connection.getRepository(Slot);

    return await slotRepository.find({
      where: { parkingLotId: parkingLotId },
      order: { number: "ASC" }
    });
  }

  private async getTicketsOfParkingLotWithId(
    parkingLotId: number
  ): Promise<Ticket[]> {
    const connection = getConnection();
    const ticketRepository = connection.getRepository(Ticket);

    return await ticketRepository.find({
      where: { parkingLotId: parkingLotId }
    });
  }

  private syncParkingLotsDataToDatabase(): void {
    this.syncParkingLots();
    this.syncSlots();
    this.syncTickets();
  }

  private async syncParkingLots(): Promise<void> {
    const connection = getConnection();
    const parkingLotRepository = connection.getRepository(ParkingLot);
    const parkingLots = this.parkingLots;

    await parkingLotRepository.save(parkingLots);
  }

  private async syncSlots(): Promise<void> {
    const connection = getConnection();
    const slotRepository = connection.getRepository(Slot);
    const slots = this.parkingLots
      .map(parkingLot => parkingLot.slots)
      .reduce((acc, slot) => acc.concat(slot), []);

    await slotRepository.save(slots);
  }

  private async syncTickets(): Promise<void> {
    const connection = getConnection();
    const ticketRepository = connection.getRepository(Ticket);
    const tickets = this.parkingLots
      .map(parkingLot => parkingLot.ticketManager.tickets)
      .reduce((acc, ticket) => acc.concat(ticket), []);

    await ticketRepository.save(tickets);
  }
}

export { ParkingLotApplication };
