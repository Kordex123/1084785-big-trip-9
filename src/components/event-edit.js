import {EVENT_TYPES} from "./event-data";
import {DESTINATIONS} from "./event-data";

export const getEditEvent = (event) => {
  return `
    <form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${event.type.image}" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${EVENT_TYPES.filter((type) => !type.isActivity).map(getEventType).join(``)}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${EVENT_TYPES.filter((type) => type.isActivity).map(getEventType).join(``)}              
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${event.type.isActivity ? `${event.type.name} in ` : `${event.type.name} to`}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${event.destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${DESTINATIONS.map((name) => `<option value="${name}"></option>`).join(``)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" 
            value="${event.startDate.getDay()}/${event.startDate.getMonth()}/${event.startDate.getFullYear()} ${event.startDate.getHours()}:${event.startDate.getMinutes()}">
          —
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" 
            value="${event.endDate.getDay()}/${event.endDate.getMonth()}/${event.endDate.getFullYear()} ${event.endDate.getHours()}:${event.endDate.getMinutes()}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${event.price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked="">
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">

        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${event.additionalOptions.map(getOffer).join(``)}    
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">
            ${event.sentences.join(`. `)}
          </p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${event.destination.photos.map((photo) =>`<img class="event__photo" src="${photo}" alt="Event photo">`).join(``)}
            </div>
          </div>
        </section>
      </section>
    </form>
  `;
};

const getEventType = (event) => {
  return `
    <div class="event__type-item">
      <input 
          id="event-type-${event.name.toLowerCase()}-1" 
          class="event__type-input  visually-hidden" 
          type="radio" 
          name="event-type" 
          value="${event.name.toLowerCase()}">
      <label 
          class="event__type-label  event__type-label--${event.name.toLowerCase()}" 
          for="event-type-${event.name.toLowerCase()}-1">
          ${event.name}
      </label>
    </div>
  `;
};

const getOffer = (offer) => {
  return `
    <div class="event__offer-selector">
      <input 
        class="event__offer-checkbox  visually-hidden" 
        id="event-offer-${offer.id}-1" 
        type="checkbox" 
        name="event-offer-${offer.id}" 
        ${offer.isAvailable ? `checked` : ``}>
      <label 
        class="event__offer-label" 
        for="event-offer-${offer.id}-1">
            <span class="event__offer-title">${offer.title}</span>
            + €
            <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `;
};
