import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity('slots')
class Slot {
  @PrimaryColumn()
  number: number;
  
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