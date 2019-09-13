import {createElement} from "./utils/render-utils";

export class TripInfo {
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
      <div class="trip-info__main">
          <h1 class="trip-info__title">Amsterdam — ... — Amsterdam</h1>
          <p class="trip-info__dates">Mar 18&nbsp;—&nbsp;21</p>
      </div>
    `;
  }
}


