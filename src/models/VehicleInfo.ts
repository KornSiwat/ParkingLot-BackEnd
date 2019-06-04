class VehicleInfo {
  readonly registrationNumber: string;
  readonly colour: string;

  constructor(registrationNumber: string, colour: string) {
    this.registrationNumber = registrationNumber;
    this.colour = colour;
  }
}

export { VehicleInfo };
