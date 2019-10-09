import Tabs from "../tabs";
import {ResultPresentation} from "../dict";

export default class TabsController {
  constructor(tripPageMainSection, pointsData, statisticsController) {
    this._tripTabs = new Tabs();
    this._tripPageMainSection = tripPageMainSection;
    this._statisticsController = statisticsController;
    this.init();

    this.refreshTabs = this.refreshTabs.bind(this);

    this._tabChoice = ResultPresentation.TABLE;
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
      case ResultPresentation.TABLE:
        this._statisticsController.hideStats();
        this._showTrip();
        break;
      case ResultPresentation.STATS:
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
