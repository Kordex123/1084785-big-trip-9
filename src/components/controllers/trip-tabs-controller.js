import {TripTabs} from "../trip-tabs";
import {resultPresentation} from "../trip-tabs-data";
import {Statistics} from "../statistics";

export class TripTabsController {
  constructor(tripPageMainSection, pointsData) {
    this._tripTabs = new TripTabs();
    this._tripPageMainSection = tripPageMainSection;
    this._statistics = new Statistics(pointsData);
    this.init();
  }

  init() {
    this._tripTabs.getElement().addEventListener(`click`, (evt) => {
      const tabs = this._tripTabs.getElement().querySelectorAll(`.trip-tabs__btn`);
      tabs.forEach((tab) => tab.classList.remove(`trip-tabs__btn--active`));
      evt.target.classList.add(`trip-tabs__btn--active`);

      switch (evt.target.textContent) {
        case resultPresentation.TABLE:
          this._statistics.getElement().style.display = `none`;
          this._show();
          break;
        case resultPresentation.STATS:
          this._hide();
          this._statistics.getElement().style.display = `block`;
          break;
      }
    });
  }

  _show() {
    this._tripPageMainSection.parentElement.style.display = `block`;
  }

  _hide() {
    this._tripPageMainSection.parentElement.style.display = `none`;
  }
}
