import AbstractComponent from "./abstract-component";
import {ResultPresentation} from "./dict";

export default class Tabs extends AbstractComponent {
  getTemplate() {
    return `
      <nav class="trip-controls__trip-tabs  trip-tabs">
        ${Object.values(ResultPresentation).map((type) => `
          <a class="trip-tabs__btn ${type === ResultPresentation.TABLE ? `trip-tabs__btn--active` : ``}"
            href="#">${type}</a>`).join(``)}
      </nav>
    `;
  }
}
