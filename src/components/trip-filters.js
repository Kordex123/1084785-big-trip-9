import {timelineFilters} from "./trip-filters-data";
import {createElement} from "./utils/render-utils";
import {TripFilter} from "./trip-filter";

export class TripFilters {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    return `
    <form class="trip-filters" action="#" method="get">
        ${Object.values(timelineFilters).map((filter) => new TripFilter(filter).getTemplate()).join(``)}
        <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
  }
}
