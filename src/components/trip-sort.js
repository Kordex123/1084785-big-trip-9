import {sortChoice} from "./sort-choice";
import {createElement} from "./utils/render-utils";
import {TripSortItem} from "./trip-sort-item";

export class TripSort {
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
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
          <span class="trip-sort__item  trip-sort__item--day">Day</span>
          ${sortChoice.map((feature) => new TripSortItem(feature).getTemplate()).join(``)}
          <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
      </form>
    `;
  }
}

