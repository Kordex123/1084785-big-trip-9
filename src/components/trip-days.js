import {getEditEvent} from "./event-edit";
import {EventIcons} from "./event-data";
import {Events} from "./event-data";
import {Activities} from "./event-data";

const getEvent = (event) => {
  return `
    <div class="event">
      <div class="event__type">
        <img 
          class="event__type-icon" 
          width="42" 
          height="42" 
          src="img/icons/${EventIcons[Events[event.type]]}" 
          alt="Event type icon">
      </div>
      <h3 class="event__title">
           ${Events[event.type]} ${Activities[event.type] ? ` in ${event.destination.name}` : ` to ${event.destination.name}`}
      </h3>

      <div class="event__schedule">
        <p class="event__time">
          <time 
            class="event__start-time" 
            datetime="${event.startDate}">
            ${event.startDate.getHours()}:${event.startDate.getMinutes()}
          </time>
          —
          <time 
            class="event__end-time" 
            datetime="${event.endDate}">
            ${event.endDate.getHours()}:${event.endDate.getMinutes()}
          </time>
        </p>
        <p 
          class="event__duration">
          1H 30M
        </p>
      </div>

      <p class="event__price">
        €&nbsp;
        <span 
          class="event__price-value">
          ${event.price}
        </span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${event.additionalOptions.map(({title, price}) =>`
        <li class="event__offer">
        <span
        class="event__offer-title">
          ${title}
        </span>
        +
        €&nbsp;
        <span
        class="event__offer-price">
          ${price}
        </span>
        </li>
  `).join(``)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`;
};

const isSameDay = (firstDate, secondDate) => {
  return firstDate.getDate() === secondDate.getDate() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getFullYear() === secondDate.getFullYear();
};

const getDayMillis = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

const getDayToCounter = (events) => {
  const allDays = events.map((event) => getDayMillis(event.startDate));
  const uniqueSortedDays = Array.from(new Set(allDays)).sort();
  return uniqueSortedDays.reduce((result, day, idx) => {
    result[day] = idx;
    return result;
  }, {});
};

const SHORT_MONTHS = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

const getDayAndMonth = (date) => {
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
};

export const getTripDays = (sortedEvents) => {
  const dayToCounter = getDayToCounter(sortedEvents);
  const groupedEvents = sortedEvents.reduce((allGroups, event) => {
    const lastGroup = allGroups[allGroups.length - 1];
    const lastEvent = lastGroup && lastGroup[lastGroup.length - 1];
    if (lastEvent && isSameDay(lastEvent.startDate, event.startDate)) {
      lastGroup.push(event);
    } else {
      const newGroup = [event];
      allGroups.push(newGroup);
    }
    return allGroups;
  }, []);
  return `
    <ul class="trip-days">
    ${groupedEvents.map((eventGroup) =>
    `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${dayToCounter[getDayMillis(eventGroup[0].startDate)] + 1}</span>
          <time 
            class="day__date" 
            datetime="${eventGroup[0].startDate}">
            ${getDayAndMonth(eventGroup[0].startDate)}
          </time>
        </div>
        <ul class="trip-events__list">
        ${eventGroup.map((eventData) =>`
          <li class="trip-events__item">
            ${getEvent(eventData)}
            ${eventData.editMode ? getEditEvent(eventData) : ``}
          </li>
        `).join(``)}
        </ul>
      </li>
    `).join(``)}
    </ul>
  `;
};

