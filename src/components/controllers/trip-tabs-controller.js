import {TripTabs} from "../trip-tabs";
import {Statistics} from "../statistics";
import {resultPresentation} from "../trip-tabs-data";

export class TripTabsController {
  constructor(tripPageMainSection) {
    this._tripTabs = new TripTabs();
    this._statistics = new Statistics();
    this._tripPageMainSection = tripPageMainSection;
    this.init();
  }

  init() {

    this._tripTabs.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      switch (evt.target.textContent) {
        case resultPresentation.TABLE:
          this._statistics.getElement().style.display = `none`;
          // this._statistics.getElement().querySelector(`h2`).style.display = `none`;
          this._show();
          break;
        case resultPresentation.STATS:
          this._hide();
          this._statistics.getElement().style.display = `block`;
          // this._statistics.getElement().querySelector(`h2`).classList.remove(`visually-hidden`);
          break;
      }
    });
  }

  _show() {
    // this._tripPageMainSection.classList.remove(`visually-hidden`);
    this._tripPageMainSection.parentElement.style.display = `block`;
  }

  _hide() {
    // this._tripPageMainSection.classList.add(`visually-hidden`);
    this._tripPageMainSection.parentElement.style.display = `none`;
  }

}
