import {SortChoice} from "./dict";
import AbstractComponent from "./abstract-component";

export default class Sort extends AbstractComponent {
  constructor(type, hasIcon) {
    super();
    this._hasIcon = hasIcon;
  }

  getTemplate() {
    return `
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
          <span class="trip-sort__item  trip-sort__item--day">Day</span>
          ${Object.values(SortChoice).map((sortType) => `
            <div class="trip-sort__item  trip-sort__item--${sortType.id}">
              <input
                id="sort-${sortType.id}"
                class="trip-sort__input  visually-hidden"
                type="radio"
                name="trip-sort"
                value="sort-${sortType.id}">
              <label
                class="trip-sort__btn"
                for="sort-${sortType.id}">
                ${sortType.name}
                ${sortType._hasIcon ? sortType._getIcon() : ``}
              </label>
            </div>
          `).join(``)}
          <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
      </form>
    `;
  }

  _getIcon() {
    return `
    <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
        <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"></path>
    </svg> `;
  }
}

