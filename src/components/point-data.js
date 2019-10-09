export const Transfers = {
  BUS: `Bus`,
  DRIVE: `Drive`,
  FLIGHT: `Flight`,
  SHIP: `Ship`,
  TAXI: `Taxi`,
  TRAIN: `Train`,
  TRANSPORT: `Transport`,
  TRIP: `Trip`,
};

export const Activities = {
  [`CHECK-IN`]: `Check-in`,
  RESTAURANT: `Restaurant`,
  SIGHTSEEING: `Sightseeing`,
};

export const Events = Object.assign({}, Transfers, Activities);
