import Statistics from "../statistics";
import {Position, render} from "../utils/render-utils";

export default class StatisticsController {
  constructor(container, pointsData, tripFiltersController) {
    this._container = container;
    this._tripFiltersController = tripFiltersController;
    this.refreshStats(pointsData);

    this.showStats = this.showStats.bind(this);
    this.hideStats = this.hideStats.bind(this);
  }

  refreshStats(pointsData) {
    pointsData = pointsData.filter(this._tripFiltersController.getFilterFunction());

    const oldStatistics = this._statistics;
    this._statistics = new Statistics(pointsData);
    if (oldStatistics) {
      oldStatistics.getElement().replaceWith(this._statistics.getElement());
      oldStatistics.removeElement();
    } else {
      render(this._container, this._statistics.getElement(), Position.AFTEREND);
    }
  }

  showStats() {
    this._statistics.getElement().style.display = `block`;
  }

  hideStats() {
    this._statistics.getElement().style.display = `none`;
  }
}
