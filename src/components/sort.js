import {sortChoice} from "./sort-choice";
import {TripSortItem} from "./trip-sort-item";
import {AbstractComponent} from "./abstract-component";

export class Sort extends AbstractComponent {
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

