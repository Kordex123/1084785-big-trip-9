import {ResultPresentations} from "./dict";
import {AbstractComponent} from "./abstract-component";

export class TripTabs extends AbstractComponent {
  getTemplate() {
    return `
      <nav class="trip-controls__trip-tabs  trip-tabs">
        ${Object.values(ResultPresentations).map((type) => `
          <a class="trip-tabs__btn ${type === ResultPresentations.TABLE ? `trip-tabs__btn--active` : ``}"
            href="#">${type}</a>`).join(``)}
      </nav>
    `;
  }
}
