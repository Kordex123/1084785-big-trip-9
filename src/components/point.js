import {Activities, EventIcons} from "./event-data";
import {AbstractComponent} from "./abstract-component";
import {getDuration} from "./utils/date-utils";
import moment from "moment";

export class Point extends AbstractComponent {
  constructor({startDate, endDate, type, destination, price, additionalOptions}) {
    super();
    this._startDate = startDate;
    this._endDate = endDate;
    this._type = type;
    this._destination = destination;
    this._price = price;
    this._additionalOptions = additionalOptions;
  }

  getTemplate() {
    return `
    <div class="event">
      <div class="event__type">
        <img 
          class="event__type-icon" 
          width="42" 
          height="42" 
          src="img/icons/${EventIcons[this._type]}" 
          alt="Event type icon">
      </div>
      <h3 class="event__title">
           ${this._type} ${Object.values(Activities).includes(this._type) ? ` in ${this._destination.name}` : ` to ${this._destination.name}`}
      </h3>

      <div class="event__schedule">
        <p class="event__time">
          <time 
            class="event__start-time" 
            datetime="${this._startDate}">
            ${moment(this._startDate).format(`HH:mm`)}
          </time>
          —
          <time 
            class="event__end-time" 
            datetime="${this._endDate}">
            ${moment(this._endDate).format(`HH:mm`)}
          </time>
        </p>
        <p 
          class="event__duration">
         ${getDuration(this._endDate, this._startDate)}
        </p>
      </div>

      <p class="event__price">
        €&nbsp;
        <span 
          class="event__price-value">
          ${this._price}
        </span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${this._additionalOptions.map(({title, price}) =>`
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
      </button>
    </div>`;
  }
}
