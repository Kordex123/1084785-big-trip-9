import {TripFilters} from "../trip-filters";
import {TimelineFilters} from "../dict";
import moment from "moment";

export class TripFiltersController {
  constructor(pointsData, refreshTrip, refreshStats) {
    this._tripFilters = new TripFilters();
    this._pointsData = pointsData;
    this._refreshTrip = refreshTrip;
    this._refreshStats = refreshStats;
    this._filterOption = TimelineFilters.EVERYTHING.id;

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
      case TimelineFilters.PAST.id:
        return (point) => point.endDate < now;
      case TimelineFilters.FUTURE.id:
        return (point) => point.startDate > now;
      default:
        return () => true;
    }
  }
}
