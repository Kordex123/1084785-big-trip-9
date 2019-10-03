import {TripFilters} from "../trip-filters";
import {timelineFilters} from "../trip-filters-data";
import moment from "moment";

export class TripFiltersController {
  constructor(pointsData, refreshTrip) {
    this._tripFilters = new TripFilters();
    this._pointsData = pointsData;
    this._refreshTrip = refreshTrip;
    this.init();
  }

  init() {

    this._tripFilters.getElement().addEventListener(`click`, (evt) => {
      let label = evt.target.closest(`label`);

      if (!label) {
        return;
      }

      const now = moment().toDate();
      switch (label.getAttribute(`for`).substring(`filter-`.length)) {
        case timelineFilters.PAST.id:
          this._refreshTrip(this._pointsData.filter((point) => point.endDate < now));
          break;
        case timelineFilters.FUTURE.id:
          this._refreshTrip(this._pointsData.filter((point) => point.startDate > now));
          break;
        default:
          this._refreshTrip(this._pointsData);
          break;
      }
    });
  }
}
