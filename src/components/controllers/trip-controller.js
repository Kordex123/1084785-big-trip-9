import {Trip} from "../trip";
import {Position, render} from "../utils/render-utils";
import {TripInfo} from "../trip-info";
import {TripFilters} from "../trip-filters";
import {Sort} from "../sort";
import {getTotalCost} from "../event-data";
import {getDurationInMinutes} from "../utils/date-utils";
import {PointController} from "./point-controller";
import {TripTabsController} from "./trip-tabs-controller";

export class TripController {
  constructor(tripPageMainSection, pointsData) {
    this._tripPageMainSection = tripPageMainSection;
    this._pointsData = pointsData;
    this._sort = new Sort();
    this._tripTabsController = new TripTabsController(this._tripPageMainSection);
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._refreshTrip = this._refreshTrip.bind(this);
    this._refreshTotalCost = this._refreshTotalCost.bind(this);
    this._removePoint = this._removePoint.bind(this);
  }

  init() {
    const tripInfoSection = document.querySelector(`.trip-main__trip-info`);
    const tripControlsSection = document.querySelector(`.trip-main__trip-controls h2:nth-child(2)`);
    this._totalCost = document.querySelector(`.trip-info__cost-value`);

    render(tripInfoSection, new TripInfo(), Position.AFTERBEGIN);
    render(tripControlsSection, this._tripTabsController._tripTabs.getElement(), Position.BEFOREBEGIN);
    render(tripControlsSection, new TripFilters().getElement(), Position.AFTEREND);
    render(this._tripPageMainSection.parentElement, this._tripTabsController._statistics.getElement(), Position.AFTEREND);

    this._points = this._pointsData.map((point) => this._renderPoint(point));
    this._trip = new Trip(this._points);
    render(this._tripPageMainSection, this._trip.getElement(), Position.AFTEREND);
    this._refreshPoints();
    render(this._tripPageMainSection, this._sort.getElement(), Position.AFTEREND);
    this._refreshTotalCost();
    this._sort.getElement()
      .addEventListener(`click`, (evt) => this._onSortClick(evt));
  }

  _refreshTrip() {
    this._points = this._pointsData.map((point) => this._renderPoint(point));
    const oldTripDay = this._trip;
    this._trip = new Trip(this._points);
    oldTripDay.getElement().replaceWith(this._trip.getElement());
    oldTripDay.removeElement();
    this._refreshPoints(this._points);
  }

  _refreshTotalCost() {
    this._totalCost.textContent = getTotalCost(this._pointsData);
  }

  _refreshPoints() {
    this._points.forEach((newPoint) => {
      const pointParent = this._getPointParent(newPoint);
      if (pointParent.hasChildNodes()) {
        pointParent.replaceChild(newPoint.getElement(), pointParent.firstElementChild);
      } else {
        pointParent.appendChild(newPoint.getElement());
      }
    });
  }

  _removePoint(pointId) {
    const indexToRemove = this._pointsData.findIndex((p) => p.id === pointId);
    this._pointsData.splice(indexToRemove, 1);
    this._refreshTrip();
  }

  _renderPoint(pointData) {
    const pointController = new PointController(pointData, this._onDataChange, this._onChangeView, this._refreshTrip, this._refreshTotalCost, this._removePoint);
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
    return pointController._pointView;
  }

  _getPointParent(pointData) {
    const position = this._trip.getPointPosition(pointData);
    const day = this._trip.getElement().querySelectorAll(`.trip-days__item`)[position.dayNo];
    const pointParent = day.querySelectorAll(`.trip-events__item`)[position.itemNo];

    return pointParent;
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _onDataChange(newData, oldData) {
    this._pointsData[this._pointsData.findIndex((el) => el === oldData)] = newData;
    this._refreshTrip(this._pointsData);
  }

  _onSortClick(evt) {
    // evt.preventDefault();
    let label = evt.target.closest(`label`);

    if (!label) {
      return;
    }

    switch (evt.target.getAttribute(`for`)) {
      case `sort-event`:
        this._pointsData = this._pointsData.sort((pointA, pointB) => pointA.startDate - pointB.startDate);
        this._refreshTrip();
        break;
      case `sort-price`:
        this._pointsData = this._pointsData.sort((pointA, pointB) => pointB.price - pointA.price);
        this._refreshTrip();
        break;
      case `sort-time`:
        this._pointsData = this._pointsData.sort((pointA, pointB) => getDurationInMinutes(pointB.endDate, pointB.startDate) - getDurationInMinutes(pointA.endDate, pointA.startDate));
        this._refreshTrip();
        break;
    }
  }
}

