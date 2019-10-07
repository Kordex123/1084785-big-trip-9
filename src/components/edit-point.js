import {Activities, Events, Transfers} from "./event-data";
import {AbstractComponent} from "./abstract-component";
import {deepCopy} from "./utils/object-utils";
import {PointModes} from "./dict";

export class EditPoint extends AbstractComponent {
  constructor({id, startDate, endDate, type, destination, price, additionalOptions, isFavorite}, offersDict, destinationDict, mode = PointModes.EDIT) {
    super();
    this._id = id;
    this._startDate = startDate;
    this._endDate = endDate;
    this._type = type;
    this._destination = deepCopy(destination);
    this._price = price;
    this._additionalOptions = additionalOptions;
    this._offersDict = offersDict;
    this._destinationDict = destinationDict;
    this._mode = mode;
    this._isFavorite = isFavorite;
    this._getOffer = this._getOffer.bind(this);
  }

  getTemplate() {
    const offers = this._offersDict.find(({type}) => type === this._type).offers;
    return `
      <form class="${this._mode === PointModes.ADD ? `trip-events__item` : ``} event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
  
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${Object.values(Transfers).map(this._getEventType).join(``)}
              </fieldset>
  
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${Object.values(Activities).map(this._getEventType).join(``)}              
              </fieldset>
            </div>
          </div>
  
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${Events[this._type.toUpperCase()]} ${Object.keys(Activities).includes(this._type.toUpperCase()) ? ` in ` : ` to `}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${this._destinationDict.map(({name}) => `<option value="${name}"></option>`).join(``)}
            </datalist>
          </div>
  
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" 
              value="${this._startDate.getMonth() + 1}/${this._startDate.getDate()}/${this._startDate.getFullYear()} ${this._startDate.getHours()}:${this._startDate.getMinutes()}">
            —
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" 
              value="${this._endDate.getMonth() + 1}/${this._endDate.getDate()}/${this._endDate.getFullYear()} ${this._endDate.getHours()}:${this._endDate.getMinutes()}">
          </div>
  
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
          </div>
  
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${this._mode === PointModes.ADD ? `Cancel` : `Delete`}</button>

          ${this._mode !== PointModes.ADD ? `
            <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : `` }>
            <label class="event__favorite-btn" for="event-favorite-1">
              <span class="visually-hidden">Add to favorite</span>
              <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
              </svg>
            </label>
    
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          ` : ``}
        </header>
  
        <section class="event__details">
         ${offers && offers.length ? `
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                <div class="event__available-offers">
                ${offers.map(this._getOffer).join(``)}    
                </div>
            </section>
          ` : ``}
  
          ${this._destination.description || this._destination.pictures ? `
            <section class="event__section  event__section--destination">
              ${this._destination.description ? `
                <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">
                  ${this._destination.description}
                </p>
              ` : ``}
              ${this._destination.pictures ? `
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${this._destination.pictures.map((picture) =>`<img class="event__photo" src="${picture.src}" alt="Event photo">`).join(``)}
                  </div>
                </div>
              ` : ``}
            </section>
          ` : ``}
        </section>
      </form>
    `;
  }

  _getEventType(eventType) {
    const type = eventType.toLowerCase();
    return `
      <div class="event__type-item">
        <input 
            id="event-type-${type}-1" 
            class="event__type-input  visually-hidden" 
            type="radio" 
            name="event-type" 
            value="${type}">
        <label 
            class="event__type-label  event__type-label--${type}" 
            for="event-type-${type}-1">
            ${eventType}
        </label>
      </div>
    `;
  }

  _getOffer(offer) {
    return `
      <div class="event__offer-selector">
        <input 
          class="event__offer-checkbox  visually-hidden" 
          type="checkbox" 
          name="event-offer"
          ${this._additionalOptions.some(({title}) => title === offer.title) ? `checked` : ``}>
        <label
          class="event__offer-label"
          for="event-offer-1">
              <span class="event__offer-title">${offer.title}</span>
              + €
              <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `;
  }
}
