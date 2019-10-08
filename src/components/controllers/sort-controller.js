import {getDurationInMinutes} from "../utils/date-utils";
import {Sort} from "../sort";
import {SortChoice} from "../dict";

export class SortController {
  constructor(pointsData, refreshTrip) {
    this._sort = new Sort();
    this._sortChoice = SortChoice.TIME;
    this._pointsData = pointsData;
    this._refreshTrip = refreshTrip;

    this.getSortFunction = this.getSortFunction.bind(this);

    this.init();
  }

  init() {

    this._sort.getElement().addEventListener(`click`, (evt) => {
      let label = evt.target.closest(`label`);
      if (!label) {
        return;
      }

      this._sortChoice = label.getAttribute(`for`).substring(`sort-`.length);
      this._refreshTrip(this._pointsData);
    });
  }

  getSortFunction() {
    switch (this._sortChoice) {
      case SortChoice.PRICE.id:
        return (pointA, pointB) => pointB.price - pointA.price;
      case SortChoice.TIME.id:
        return (pointA, pointB) => getDurationInMinutes(pointB.endDate, pointB.startDate) - getDurationInMinutes(pointA.endDate, pointA.startDate);
      default:
        return (pointA, pointB) => pointA.startDate - pointB.startDate;
    }
  }
}
