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
const getRandomDate = (minDate, isStartDate) => {
  const MIN_HOUR = 7;
  const MAX_HOUR = 22;
  const MAX_DURATION_IN_HOURS = 3;
  let date;
  if (minDate) {
    date = new Date(minDate);
  } else {
    date = new Date();
    date.setHours(MIN_HOUR, 0, 0, 0);
  }
  const probabilityOfNextDay = getRandomNumber(0, 100) < 30;
  const isNextDay = isStartDate && (probabilityOfNextDay || date.getHours() + MAX_DURATION_IN_HOURS >= MAX_HOUR);
  if (isNextDay) {
    date.setDate(date.getDate() + 1);
    date.setHours(getRandomNumber(MIN_HOUR, MAX_HOUR));
    date.setMinutes(getRandomNumber(0, 3) * 15);
  } else {
    const maxDate = date;
    maxDate.setHours(maxDate.getHours() + MAX_DURATION_IN_HOURS);
    date.setTime(getRandomNumber(date.getTime(), maxDate.getTime()));
  }
  return date;
};

export const EVENT_TYPES = [
  {name: `Bus`, image: `bus.png`},
  {name: `Drive`, image: `drive.png`},
  {name: `Flight`, image: `flight.png`},
  {name: `Ship`, image: `ship.png`},
  {name: `Taxi`, image: `taxi.png`},
  {name: `Train`, image: `train.png`},
  {name: `Transport`, image: `transport.png`},
  {name: `Trip`, image: `trip.png`},
  {name: `Check`, image: `check-in.png`, isActivity: true},
  {name: `Restaurant`, image: `restaurant.png`, isActivity: true},
  {name: `Sightseeing`, image: `sightseeing.png`, isActivity: true},
];

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


export const DESTINATIONS = [
  {name: `Amsterdam`, photos: getRandomPhotos()},
  {name: `Geneva`, photos: getRandomPhotos()},
  {name: `Charmonix`, photos: getRandomPhotos()},
  {name: `airport`, photos: getRandomPhotos()},
  {name: `Natural History Museum`, photos: getRandomPhotos()},
  {name: `Cerro Torre`, photos: getRandomPhotos()},
  {name: `Grand Canyon`, photos: getRandomPhotos()},
  {name: `Dead Sea`, photos: getRandomPhotos()},
  {name: `Rome`, photos: getRandomPhotos()},
];

export const ADDITIONAL_OPTIONS = [
  {id: `luggage`, title: `Add luggage`, price: getRandomNumber(3, 5) * 5},
  {id: `comfort`, title: `Switch to comfort class`, price: getRandomNumber(6, 20) * 10},
  {id: `meal`, title: `Add meal`, price: getRandomNumber(2, 7) * 5},
  {id: `seats`, title: `Choose seats`, price: getRandomNumber(1, 4) * 5},
  {id: `train`, title: `Travel by train`, price: getRandomNumber(3, 6) * 5}
];

const getEventData = ({previousEvent, editMode = false}) => {
  const startDate = getRandomDate(previousEvent && previousEvent.endDate, true);
  const endDate = getRandomDate(startDate);
  return {
    startDate,
    endDate,
    editMode,
    type: getRandomElement(EVENT_TYPES),
    destination: getRandomElement(DESTINATIONS),
    price: getRandomNumber(1, 17) * 10,
    additionalOptions: getRandomElements(ADDITIONAL_OPTIONS, 0, 2),
    sentences: getRandomElements(SENTENCES, 1, 3)
  };
};

export const getEvents = () => Array(4).fill(``).map((element, idx, events) => {
  if (idx === 0) {
    events[0] = getEventData({editMode: true});
  } else {
    events[idx] = getEventData({previousEvent: events[idx - 1]});
  }
  return events[idx];
});

export const getTotalCost = (events) => {
  return events.reduce((total, {price}) => total + price, 0);
};


