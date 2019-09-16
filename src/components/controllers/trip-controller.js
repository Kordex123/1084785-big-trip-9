import {Trip} from "../trip";
import {Position, render} from "../utils/render-utils";
import {Point} from "../point";
import {EditPoint} from "../edit-point";
import {TripInfo} from "../trip-info";
import {TripTabs} from "../trip-tabs";
import {TripFilters} from "../trip-filters";
import {Sort} from "../sort";
import {getTotalCost} from "../event-data";
import {getDuration} from "../utils/date-utils";

export class TripController {
  constructor(tripPageMainSection, pointData) {
    this._tripPageMainSection = tripPageMainSection;
    this._pointData = pointData;
    this._sort = new Sort();
  }

  init() {
    const tripInfoSection = document.querySelector(`.trip-main__trip-info`);
    const tripControlsSection = document.querySelector(`.trip-main__trip-controls h2:nth-child(2)`);
    const totalCost = document.querySelector(`.trip-info__cost-value`);

    render(tripInfoSection, new TripInfo().getElement(), Position.AFTERBEGIN);
    render(tripControlsSection, new TripTabs().getElement(), Position.BEFOREBEGIN);
    render(tripControlsSection, new TripFilters().getElement(), Position.AFTEREND);

    this._points = this._pointData.map((point) => this._renderPoint(point));
    this._trip = new Trip(this._points);
    render(this._tripPageMainSection, this._trip.getElement(), Position.AFTEREND);
    this._refreshPoints();
    render(this._tripPageMainSection, this._sort.getElement(), Position.AFTEREND);
    totalCost.textContent = getTotalCost(this._pointData);
    this._sort.getElement()
      .addEventListener(`click`, (evt) => this._onSortClick(evt));
  }

  _refreshPoints() {
    this._points.forEach((newPoint) => {
      const position = this._trip.getPointPosition(newPoint);
      const day = this._trip.getElement().querySelectorAll(`.trip-days__item`)[position.dayNo];
      const pointParent = day.querySelectorAll(`.trip-events__item`)[position.itemNo];
      if (pointParent.hasChildNodes()) {
        pointParent.replaceChild(newPoint.getElement(), pointParent.firstElementChild);
      } else {
        pointParent.appendChild(newPoint.getElement());
      }
    });
  }

  _removePoint(pointId) {
    const indexToRemove = this._pointData.findIndex((p) => p.id === pointId);
    this._pointData.splice(indexToRemove, 1);
    this._refreshTrip();
  }

  _refreshTrip() {
    this._points = this._pointData.map((point) => this._renderPoint(point));
    const oldTripDay = this._trip;
    this._trip = new Trip(this._points);
    oldTripDay.getElement().replaceWith(this._trip.getElement());
    oldTripDay.removeElement();
    this._refreshPoints(this._points);
  }

  _renderPoint(pointData) {
    const pointComponent = new Point(pointData);
    const editPointComponent = new EditPoint(pointData);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        editPointComponent.getElement().replaceWith(pointComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    editPointComponent.getElement().querySelector(`.event__input--destination`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    editPointComponent.getElement().querySelector(`[name=event-start-time]`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    editPointComponent.getElement().querySelector(`[name=event-end-time]`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    editPointComponent.getElement().querySelector(`.event__input--price`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    editPointComponent.getElement().querySelector(`.event__input--destination`)
    .addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    editPointComponent.getElement().querySelector(`.event__input--destination`)
    .addEventListener(`input`, (event) => {
      pointData.destination.name = event.target.value;
    });

    editPointComponent.getElement()
    .addEventListener(`submit`, (event) => {
      event.preventDefault();
      this._refreshTrip();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    editPointComponent.getElement()
    .querySelector(`.event__reset-btn`)
    .addEventListener(`click`, () => {
      this._removePoint(pointData.id);
      pointComponent.removeElement();
      editPointComponent.removeElement();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    pointComponent.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      pointComponent.getElement().replaceWith(editPointComponent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    editPointComponent.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      editPointComponent.getElement().replaceWith(pointComponent.getElement());
    });

    return pointComponent;
  }

  _onSortClick(evt) {
    evt.preventDefault();
    let label = evt.target.closest(`label`);

    if (!label) {
      return;
    }

    switch (evt.target.getAttribute(`for`)) {
      case `sort-event`:
        this._pointData = this._pointData.sort((pointA, pointB) => pointA.startDate - pointB.startDate);
        this._refreshTrip();
        break;
      case `sort-price`:
        this._pointData = this._pointData.sort((pointA, pointB) => pointB.price - pointA.price);
        this._refreshTrip();
        break;
      case `sort-time`:
        this._pointData = this._pointData.sort((pointA, pointB) => getDuration(pointB.endDate, pointB.startDate) - getDuration(pointA.endDate, pointA.startDate));
        this._refreshTrip();
        break;
    }
  }
}

