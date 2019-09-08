const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = (list) => list[getRandomNumber(0, list.length - 1)];
const getRandomElements = (list, min, max) => {
  const listCopy = [...list];
  const count = getRandomNumber(min, max);
  const elements = [];
  while (elements.length < count) {
    const chosenIndex = getRandomNumber(0, listCopy.length - 1);
    const chosenElement = listCopy.splice(chosenIndex, 1)[0];
    elements.push(chosenElement);
  }
  return elements;
};
const getRandomPhotos = () => Array(getRandomNumber(2, 5)).fill(``).map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
const getRandomDate = (minDate, canBeNextDay) => {
  const minHour = 7;
  const maxHour = 22;
  const maxDurationInHours = 3;
  let date;
  if (minDate) {
    date = new Date(minDate);
  } else {
    date = new Date();
    date.setHours(minHour, 0, 0, 0);
  }
  const probabilityOfNextDay = getRandomNumber(0, 100) < 30;
  const isNextDay = canBeNextDay && (probabilityOfNextDay || date.getHours() + maxDurationInHours >= maxHour);
  if (isNextDay) {
    date.setDate(date.getDate() + 1);
    date.setHours(getRandomNumber(minHour, maxHour));
    date.setMinutes(getRandomNumber(0, 3) * 15);
  } else {
    const maxDate = date;
    maxDate.setHours(maxDate.getHours() + maxDurationInHours);
    date.setTime(getRandomNumber(date.getTime(), maxDate.getTime()));
  }
  return date;
};

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
  CHECK: `Check`,
  RESTAURANT: `Restaurant`,
  SIGHTSEEING: `Sightseeing`,
};

export const Events = Object.assign({}, Transfers, Activities);

export const EventIcons = {
  [Transfers.BUS]: `bus.png`,
  [Transfers.DRIVE]: `drive.png`,
  [Transfers.FLIGHT]: `flight.png`,
  [Transfers.SHIP]: `ship.png`,
  [Transfers.TAXI]: `taxi.png`,
  [Transfers.TRAIN]: `train.png`,
  [Transfers.TRANSPORT]: `transport.png`,
  [Transfers.TRIP]: `trip.png`,
  [Activities.CHECK]: `check-in.png`,
  [Activities.RESTAURANT]: `restaurant.png`,
  [Activities.SIGHTSEEING]: `sightseeing.png`,
};

const SENTENCES = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Cras aliquet varius magna, non porta ligula feugiat eget. 
    Fusce tristique felis at fermentum pharetra.
    Aliquam id orci ut lectus varius viverra. 
    Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. 
    Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. 
    Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. 
    Sed sed nisi sed augue convallis suscipit in sed felis. 
    Aliquam erat volutpat. 
    Nunc fermentum tortor ac porta dapibus. 
    In rutrum ac purus sit amet tempus.`.split(`.`).filter(Boolean);


export const Destinations = [
  {name: `Amsterdam`, pictures: getRandomPhotos()},
  {name: `Geneva`, pictures: getRandomPhotos()},
  {name: `Charmonix`, pictures: getRandomPhotos()},
  {name: `airport`, pictures: getRandomPhotos()},
  {name: `Natural History Museum`, pictures: getRandomPhotos()},
  {name: `Cerro Torre`, pictures: getRandomPhotos()},
  {name: `Grand Canyon`, pictures: getRandomPhotos()},
  {name: `Dead Sea`, pictures: getRandomPhotos()},
  {name: `Rome`, pictures: getRandomPhotos()},
];

export const Offer = [
  {id: `luggage`, title: `Add luggage`, price: getRandomNumber(3, 5) * 5},
  {id: `comfort`, title: `Switch to comfort class`, price: getRandomNumber(6, 20) * 10},
  {id: `meal`, title: `Add meal`, price: getRandomNumber(2, 7) * 5},
  {id: `seats`, title: `Choose seats`, price: getRandomNumber(1, 4) * 5},
  {id: `train`, title: `Travel by train`, price: getRandomNumber(3, 6) * 5}
];

const getEventData = ({previousDate, editMode = false}) => {
  const startDate = getRandomDate(previousDate, true);
  const endDate = getRandomDate(startDate);
  return {
    startDate,
    endDate,
    editMode,
    type: getRandomElement(Object.keys(Events)),
    destination: getRandomElement(Destinations),
    price: getRandomNumber(1, 17) * 10,
    additionalOptions: getRandomElements(Offer, 0, 2),
    sentences: getRandomElements(SENTENCES, 1, 3)
  };
};

export const getEvents = () => Array(4).fill(``).reduce((elements, event, idx) => {
  if (idx === 0) {
    elements.push(getEventData({editMode: true}));
  } else {
    elements.push(getEventData({previousDate: elements[idx - 1].endDate}));
  }
  return elements;
}, []);

export const getTotalCost = (events) => {
  return events.reduce((total, {price}) => total + price, 0);
};

