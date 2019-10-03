import {getDurationInMinutes} from "../utils/date-utils";
import {Sort} from "../sort";
import {sortChoice} from "../sort-choice";

export class SortController {
  constructor(pointsData, refreshTrip) {
    this._sort = new Sort();
    this._pointsData = pointsData;
    this._refreshTrip = refreshTrip;
    this.init();
  }

  init() {

    this._sort.getElement().addEventListener(`click`, (evt) => {
      let label = evt.target.closest(`label`);
      if (!label) {
        return;
      }

      switch (label.getAttribute(`for`).substring(`sort-`.length)) {
        case sortChoice.EVENT.id:
          this._refreshTrip(this._pointsData.sort((pointA, pointB) => pointA.startDate - pointB.startDate));
          break;
        case sortChoice.PRICE.id:
          this._refreshTrip(this._pointsData.sort((pointA, pointB) => pointB.price - pointA.price));
          break;
        case sortChoice.TIME.id:
          this._refreshTrip(this._pointsData.sort((pointA, pointB) => getDurationInMinutes(pointB.endDate, pointB.startDate) - getDurationInMinutes(pointA.endDate, pointA.startDate)));
          break;
      }

    });
  }
}
