import {getEventEdit} from "./event-edit";

export const getTripDays = () => {
  return `
    <ul class="trip-days">
    ${Array(3).fill(``).map(getTripDaysItem).join(``)}
    </ul>
  `;
};

const getTripDaysItem = () => {
  return `
    <li class="trip-days__item  day">
      ${getDayInfo()}
      ${getTripEventsList()}
    </li>
  `;
};

const getDayInfo = () => {
  return `
    <div class="day__info">
      <span class="day__counter">1</span>
      <time 
        class="day__date" 
        datetime="2019-03-18">
        MAR 18
      </time>
    </div>
  `;
};

const getTripEventsList = () => {
  return `
    <ul class="trip-events__list">
        ${Array(4).fill().map(getTripEventsItem).join(``)}
    </ul>
  `;
};

const getTripEventsItem = () => {
  return `
    <li class="trip-events__item">
        ${getEvent()}
        ${getEventEdit()}
    </li>
  `;
};

const getEvent = () => {
  return `
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
      </div>
      <h3 class="event__title">Taxi to airport</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">10:30</time>
          —
          <time class="event__end-time" datetime="2019-03-18T11:00">11:00</time>
        </p>
        <p class="event__duration">1H 30M</p>
      </div>

      <p class="event__price">
        €&nbsp;<span class="event__price-value">20</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        <li class="event__offer">
          <span class="event__offer-title">Order Uber</span>
          +
          €&nbsp;<span class="event__offer-price">20</span>
         </li>
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`;
};
