import {AbstractComponent} from "./abstract-component";

export class TripSortItem extends AbstractComponent {
  constructor({type, hasIcon}) {
    super();
    this._type = type;
    this._hasIcon = hasIcon;
  }

  getTemplate() {
    const name = this._type;
    return `
    <div class="trip-sort__item  trip-sort__item--${name.toLowerCase()}">
      <input
        id="sort-${name.toLowerCase()}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${name.toLowerCase()}">
      <label
        class="trip-sort__btn"
        for="sort-${name.toLowerCase()}">
        ${name}
        ${this._hasIcon ? this._getIcon() : ``}
      </label>

    </div>
  `;
  }

  _getIcon() {
    return `
    <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
        <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"></path>
    </svg> `;
  }
}
