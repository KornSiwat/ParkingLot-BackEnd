import { Entity, Column, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ParkingLot } from "./ParkingLot";

@Entity('slots')
class Slot {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ManyToOne(type => ParkingLot, parkingLot => parkingLot.slots)
  readonly parkingLot: ParkingLot;

  @Column()
  readonly number: number;
  
  @Column()
  isOccupied: boolean;


  constructor(slotNumber: number) {
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