import {resultPresentation} from "./trip-tabs-data";
import {createElement} from "./utils/render-utils";

export class TripTabs {
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
      <nav class="trip-controls__trip-tabs  trip-tabs">
         ${Object.values(resultPresentation).map((type) => `<a class="trip-tabs__btn" href="#">${type}</a>`).join(``)}
      </nav>
    `;
  }
}
