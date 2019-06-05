import { VehicleInfo } from "./VehicleInfo";
import { PrimaryColumn, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("tickets")
class Ticket {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  readonly slotNumber: number;

  @Column("simple-json")
  readonly vehicleInfo: VehicleInfo;

  @Column()
  readonly parkingLotId: number;

  constructor(
    parkingLotId: number,
    slotNumber: number,
    vehicleInfo: VehicleInfo
  ) {
    this.parkingLotId = parkingLotId;
    this.slotNumber = slotNumber;
    this.vehicleInfo = vehicleInfo;
  }
}

export { Ticket };
