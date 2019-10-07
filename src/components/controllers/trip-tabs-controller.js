import {TripTabs} from "../trip-tabs";
import {ResultPresentations} from "../dict";

export class TripTabsController {
  constructor(tripPageMainSection, pointsData, statisticsController) {
    this._tripTabs = new TripTabs();
    this._tripPageMainSection = tripPageMainSection;
    this._statisticsController = statisticsController;
    this.init();

    this.refreshTabs = this.refreshTabs.bind(this);

    this._tabChoice = ResultPresentations.TABLE;
    this.refreshTabs();
  }

  init() {
    this._tripTabs.getElement().addEventListener(`click`, (evt) => {
      const tabs = this._tripTabs.getElement().querySelectorAll(`.trip-tabs__btn`);
      tabs.forEach((tab) => tab.classList.remove(`trip-tabs__btn--active`));
      evt.target.classList.add(`trip-tabs__btn--active`);
      this._tabChoice = evt.target.textContent;
      this.refreshTabs();
    });
  }

  refreshTabs() {
    switch (this._tabChoice) {
      case ResultPresentations.TABLE:
        this._statisticsController.hideStats();
        this._showTrip();
        break;
      case ResultPresentations.STATS:
        this._hideTrip();
        this._statisticsController.showStats();
        break;
    }
  }

  _showTrip() {
    this._tripPageMainSection.parentElement.style.display = `block`;
  }

  _hideTrip() {
    this._tripPageMainSection.parentElement.style.display = `none`;
  }
}
