import { VehicleInfo } from "./VehicleInfo";
import { PrimaryColumn, Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ParkingLot } from "./ParkingLot";

@Entity("tickets")
class Ticket {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  readonly parkingLotId: number;

  @Column()
  readonly slotNumber: number;

  @Column("simple-json")
  readonly vehicleInfo: VehicleInfo;

  @ManyToOne(type => ParkingLot, parkingLot => parkingLot._tickets)
  readonly parkingLot: ParkingLot;

  constructor(
    parkingLotId: number,
    slotNumber: number,
    vehicleInfo: VehicleInfo,
  ) {
    this.parkingLotId = parkingLotId;
    this.slotNumber = slotNumber;
    this.vehicleInfo = vehicleInfo;
  }
}

export { Ticket };
