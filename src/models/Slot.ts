import { Entity, Column, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ParkingLot } from "./ParkingLot";

@Entity('slots')
class Slot {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  readonly number: number;
  
  @Column()
  isOccupied: boolean;

  @ManyToOne(type => ParkingLot, parkingLot => parkingLot.slots)
  readonly parkingLot: ParkingLot;

  constructor(slotNumber: number, parkingLot: ParkingLot) {
    this.parkingLot = parkingLot;
    this.number = slotNumber;
    this.isOccupied = false;
  }

  public makeAvailable() {
    this.isOccupied = false;
  }

  public allocate() {
    this.isOccupied = true;
  }
}

export { Slot };