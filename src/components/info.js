import AbstractComponent from "./abstract-component";
import moment from "moment";

export default class Info extends AbstractComponent {
  constructor(pointsData) {
    super();
    this._pointsData = pointsData.sort((pointA, pointB) => pointA.startDate - pointB.startDate);
    this._length = this._pointsData.length;
    this._begin = this._pointsData[0];
    this._end = this._pointsData[this._length - 1];
  }

  _getTitle() {
    switch (this._length) {
      case 0: return ``;
      case 1: return this._begin.destination.name;
      case 2: return `${this._begin.destination.name} - ${this._end.destination.name}`;
      case 3: return `${this._begin.destination.name} - ${this._pointsData[1].destination.name} - ${this._end.destination.name}`;
      default: return `${this._begin.destination.name} - ... - ${this._end.destination.name}`;
    }
  }

  _getDate() {
    switch (this._length) {
      case 0: return ``;
      case 1: return moment(this._begin.startDate).format(`DD MMM`);
      default: return moment(this._begin.startDate).isSame(this._end.endDate, `month`) ?
        `${moment(this._begin.startDate).format(`MMM DD`)} - ${moment(this._end.endDate).format(`DD`)}` :
        `${moment(this._begin.startDate).format(`MMM DD`)} - ${moment(this._end.endDate).format(`MMM DD`)}`;
    }
  }

  getTemplate() {
    return `
      <div class="trip-info__main">
        <h1 class="trip-info__title">${this._getTitle()}</h1>
          <p class="trip-info__dates">${this._getDate()}</p>
      </div>
    `;
  }
}


