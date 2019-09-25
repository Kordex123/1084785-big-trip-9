import {deepCopy} from "./utils/object-utils";

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = (list) => list[getRandomNumber(0, list.length - 1)];
const getRandomElements = (list, min, max) => {
  const listCopy = [...list];
  const count = getRandomNumber(Math.min(list.length, min), Math.min(list.length, max));
  const elements = [];
  while (elements.length < count) {
    const chosenIndex = getRandomNumber(0, listCopy.length - 1);
    const chosenElement = listCopy.splice(chosenIndex, 1)[0];
    elements.push(chosenElement);
  }
  return elements;
};
const getRandomPhotos = () => Array(getRandomNumber(2, 5)).fill(``).map(() => ({
  src: `http://picsum.photos/300/150?r=${Math.random()}`
}));

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
    date.setMinutes(date.getMinutes() + getRandomNumber(1, 4 * maxDurationInHours) * 15);
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
  {name: `Amsterdam`, description: getRandomElements(SENTENCES, 1, 3), pictures: getRandomPhotos()},
  {name: `Geneva`, description: getRandomElements(SENTENCES, 1, 3), pictures: getRandomPhotos()},
  {name: `Charmonix`, description: getRandomElements(SENTENCES, 1, 3), pictures: getRandomPhotos()},
  {name: `airport`, description: getRandomElements(SENTENCES, 1, 3), pictures: getRandomPhotos()},
  {name: `Natural History Museum`, description: getRandomElements(SENTENCES, 1, 3), pictures: getRandomPhotos()},
  {name: `Cerro Torre`, description: getRandomElements(SENTENCES, 1, 3), pictures: getRandomPhotos()},
  {name: `Grand Canyon`, description: getRandomElements(SENTENCES, 1, 3), pictures: getRandomPhotos()},
  {name: `Dead Sea`, description: getRandomElements(SENTENCES, 1, 3), pictures: getRandomPhotos()},
  {name: `Rome`, description: getRandomElements(SENTENCES, 1, 3), pictures: getRandomPhotos()},
];

export const Offer = [
  {
    type: Events.TAXI,
    offers: [
      {title: `Add luggage`, price: getRandomNumber(3, 5) * 5},
      {title: `Upgrade to a business class`, price: getRandomNumber(7, 14) * 5}
    ]
  },
  {
    type: Events.TRAIN,
    offers: [
      {title: `Book a taxi at the arrival point`, price: getRandomNumber(4, 6) * 5},
      {title: `Order a breakfast`, price: getRandomNumber(1, 5) * 5},
      {title: `Wake up at a certain time`, price: getRandomNumber(1, 5) * 5}
    ]
  },
  {
    type: Events.RESTAURANT,
    offers: [
      {title: `Choose live music`, price: getRandomNumber(4, 6) * 5},
      {title: `Choose VIP area`, price: getRandomNumber(1, 5) * 5},
    ]
  },
  {
    type: Events.DRIVE,
    offers: [
      {title: `Choose comfort class`, price: getRandomNumber(8, 11) * 5},
      {title: `Choose business class`, price: getRandomNumber(5, 7) * 5}
    ]
  },
  {
    type: Events.SHIP,
    offers: [
      {title: `Choose seats`, price: getRandomNumber(1, 4) * 5},
      {title: `Upgrade to comfort class`, price: getRandomNumber(8, 11) * 5}
    ]
  },
  {
    type: Events.SIGHTSEEING,
    offers: [],
  },
  {
    type: Events.CHECK,
    offers: [
      {title: `Choose the time of check-in`, price: 30},
      {title: `Choose the time of check-out`, price: 180},
      {title: `Add breakfast`, price: 120},
      {title: `Laundry`, price: 160}
    ]
  },
  {
    type: Events.FLIGHT,
    offers: [
      {title: `Choose meal`, price: 170},
      {title: `Choose seats`, price: 100},
      {title: `Upgrade to comfort class`, price: 40},
      {title: `Upgrade to business class`, price: 140},
      {title: `Additional lagguage`, price: 85},
    ]
  },
  {
    type: Events.TRANSPORT,
    offers: [
      {title: `Drive quickly, I'm in a hurry`, price: 60},
      {title: `Drive slowly`, price: 180}
    ]
  },
  {
    type: Events.BUS,
    offers:
      [
        {title: `Infotainment system`, price: 100}
      ]
  },
  {
    type: Events.TRIP,
    offers:
      [
        {title: `Guide service`, price: 100}
      ]
  }

];

const getEventData = ({previousDate, editMode = false, id}) => {
  const startDate = getRandomDate(previousDate, true);
  const endDate = getRandomDate(startDate);
  const offerType = getRandomElement(Object.values(Events));
  return {
    id,
    startDate,
    endDate,
    editMode,
    type: offerType,
    destination: deepCopy(getRandomElement(Destinations)),
    price: getRandomNumber(1, 17) * 10,
    additionalOptions: getRandomElements(Offer.find(({type}) => type === offerType).offers, 0, 2),
    // sentences: getRandomElements(SENTENCES, 1, 3)
  };
};

export const getEvents = () => Array(3).fill(``).reduce((elements, event, idx) => {
  if (idx === 0) {
    elements.push(getEventData({editMode: true, id: idx}));
  } else {
    elements.push(getEventData({previousDate: elements[idx - 1].endDate, id: idx}));
  }
  return elements;
}, []);

export const getTotalCost = (events) => {
  return events.reduce((total, {price, additionalOptions}) => {
    total += price;
    for (let offer of additionalOptions) {
      total += (offer.price);
    }
    return total;
  }, 0);
};

