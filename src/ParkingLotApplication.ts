import { ParkingLot } from "./models/ParkingLot";
import { Car } from "./models/Car";
import { Ticket } from "./models/Ticket";
import { getConnection } from "typeorm";

class ParkingLotApplication {
  public async createParkingLot(slotAmount: number): Promise<string> {
    const newParkingLot = new ParkingLot();
    const slots = newParkingLot.createSlots(slotAmount);

    newParkingLot.slots = slots;

    await this.syncParkingLotWithDatabase(newParkingLot);

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
      const parkingLot = await this.getParkingLot(parkingLotId);

      parkingLot.carIn(car);

      this.syncParkingLotWithDatabase(parkingLot);

      console.log(`Allocated Slot Number: ${car.ticket.slotNumber}`);

      return `Allocated Slot Number: ${car.ticket.slotNumber}`;
    } catch (err) {
      console.log("Sorry, parking lot is full");

      return "Sorry, parking lot is full";
    }
  }

  public async status(parkingLotId: number): Promise<string> {
    const table: string[] = await this.getStatusTable(parkingLotId);

    this.renderTable(table);

    return table.join("\n");
  }

  private renderTable(table: string[]): void {
    table.map(row => console.log(row));
  }

  private async getStatusTable(parkingLotId: number): Promise<string[]> {
    const table: string[] = [];

    this.makeStatusTableHeader(table);
    await this.makeStatusTableBody(parkingLotId, table);

    return table;
  }

  public async leave(
    parkingLotId: number,
    slotNumber: number
  ): Promise<string> {
    const parkingLot = await this.getParkingLot(parkingLotId);
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

    this.deleteTicketInDatabase(parkingLotId, slotNumber);

    this.syncParkingLotWithDatabase(parkingLot);

    console.log(`Slot number ${slotNumber} is free`);

    return `Slot number ${slotNumber} is free`;
  }

  public async registrationNumbersForCarsWithColour(
    parkingLotId: number,
    colour: string
  ): Promise<string> {
    const parkingLot = await this.getParkingLot(parkingLotId);
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
    const parkingLot = await this.getParkingLot(parkingLotId);
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
      const parkingLot = await this.getParkingLot(parkingLotId);
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
    const parkingLot = await this.getParkingLot(parkingLotId);
    parkingLot.tickets.forEach(ticket => {
      const row = `${ticket.slotNumber}         ${
        ticket.vehicleInfo.registrationNumber
      }      ${ticket.vehicleInfo.colour}`;

      table.push(row);
    });
  }

  private async getParkingLot(parkingLotId: number): Promise<ParkingLot> {
    try {
      const connection = getConnection();
      const parkingLotRepository = connection.getRepository(ParkingLot);
  
      return await parkingLotRepository.findOneOrFail(parkingLotId);
    } catch {
      throw new Error(`Parking Lot With Id ${parkingLotId} Not Found`);
    }
  }

  private async syncParkingLotWithDatabase(
    parkingLot: ParkingLot
  ): Promise<void> {
    const connection = getConnection();
    const parkingLotRepository = connection.getRepository(ParkingLot);

    await parkingLotRepository.save(parkingLot);
  }

  private async deleteTicketInDatabase(
    parkingLotId: number,
    slotNumber: number
  ) {
    const connection = getConnection();

    await connection
      .createQueryBuilder()
      .delete()
      .from(Ticket)
      .where({ parkingLotId: parkingLotId, slotNumber: slotNumber })
      .execute();
  }
}

export { ParkingLotApplication };
