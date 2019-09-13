import {createElement} from "./utils/render-utils";

export class TripFilter {
  constructor(type) {
    this._type = type;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    const name = this._type;
    return `
  <div class="trip-filters__filter">
      <input 
          id="filter-${name.toLowerCase()}" 
          class="trip-filters__filter-input  visually-hidden" 
          type="radio" 
          name="trip-filter" 
          value="${name.toLowerCase()}" 
          checked="">
      <label 
          class="trip-filters__filter-label" 
          for="filter-${name.toLowerCase()}">
          ${name}
      </label>
  </div>
  `;
  }
}
