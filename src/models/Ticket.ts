import { VehicleInfo } from './VehicleInfo';
import { PrimaryColumn, Entity, Column } from 'typeorm';

@Entity()
class Ticket {
  @PrimaryColumn()
  readonly slotNumber: number;

  @Column('simple-json')
  readonly vehicleInfo: VehicleInfo;

  constructor(slotNumber: number, vehicleInfo: VehicleInfo) {
    this.slotNumber = slotNumber;
    this.vehicleInfo = vehicleInfo;
  }
}

export { Ticket };