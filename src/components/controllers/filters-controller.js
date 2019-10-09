import Filters from "../filters";
import {TimelineFilter} from "../dict";
import moment from "moment";

export default class FiltersController {
  constructor(pointsData, refreshTrip, refreshStats) {
    this._tripFilters = new Filters();
    this._pointsData = pointsData;
    this._refreshTrip = refreshTrip;
    this._refreshStats = refreshStats;
    this._filterOption = TimelineFilter.EVERYTHING.id;

    this.getFilterFunction = this.getFilterFunction.bind(this);

    this.init();
  }

  init() {

    this._tripFilters.getElement().addEventListener(`click`, (evt) => {
      let label = evt.target.closest(`label`);

      if (!label) {
        return;
      }

      this._filterOption = label.getAttribute(`for`).substring(`filter-`.length);
      this._refreshTrip(this._pointsData);
      this._refreshStats(this._pointsData);
    });
  }

  getFilterFunction() {
    const now = moment().toDate();
    switch (this._filterOption) {
      case TimelineFilter.PAST.id:
        return (point) => point.endDate < now;
      case TimelineFilter.FUTURE.id:
        return (point) => point.startDate > now;
      default:
        return () => true;
    }
  }
}
