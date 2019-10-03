import {resultPresentation} from "./trip-tabs-data";
import {AbstractComponent} from "./abstract-component";

export class TripTabs extends AbstractComponent {
  getTemplate() {
    return `
      <nav class="trip-controls__trip-tabs  trip-tabs">
        ${Object.values(resultPresentation).map((type) => `
          <a class="trip-tabs__btn ${type === resultPresentation.TABLE ? `trip-tabs__btn--active` : ``}"
            href="#">${type}</a>`).join(``)}
      </nav>
    `;
  }
}
