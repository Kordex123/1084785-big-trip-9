import {Trip} from "../trip";
import {Position, render} from "../utils/render-utils";
import {TripInfo} from "../trip-info";
import {getTotalCost} from "../event-data";
import {PointController} from "./point-controller";
import {TripTabsController} from "./trip-tabs-controller";
import {TripFiltersController} from "./trip-filters-controller";
import {SortController} from "./sort-controller";

export class TripController {
  constructor(tripPageMainSection, pointsData) {
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._refreshTrip = this._refreshTrip.bind(this);
    this._refreshTotalCost = this._refreshTotalCost.bind(this);
    this._removePoint = this._removePoint.bind(this);

    this._tripPageMainSection = tripPageMainSection;
    this._pointsData = pointsData;
    this._sortController = new SortController(this._pointsData, this._refreshTrip);
    this._tripInfo = new TripInfo(this._pointsData);
    this._tripFiltersController = new TripFiltersController(this._pointsData, this._refreshTrip);
    this._tripTabsController = new TripTabsController(this._tripPageMainSection, this._pointsData);
    this._subscriptions = [];

    this._init();
  }

  _init() {
    const tripInfoSection = document.querySelector(`.trip-main__trip-info`);
    const tripControlsSection = document.querySelector(`.trip-main__trip-controls h2:nth-child(2)`);
    this._totalCost = document.querySelector(`.trip-info__cost-value`);

    render(tripInfoSection, this._tripInfo.getElement(), Position.AFTERBEGIN);
    render(tripControlsSection, this._tripTabsController._tripTabs.getElement(), Position.BEFOREBEGIN);
    render(tripControlsSection, this._tripFiltersController._tripFilters.getElement(), Position.AFTEREND);
    render(this._tripPageMainSection.parentElement, this._tripTabsController._statistics.getElement(), Position.AFTEREND);

    this._refreshTrip(this._pointsData);
    render(this._tripPageMainSection, this._trip.getElement(), Position.AFTEREND);
    render(this._tripPageMainSection, this._sortController._sort.getElement(), Position.AFTEREND);
  }

  _refreshTrip(pointsData) {
    const points = pointsData.map((point) => this._renderPoint(point));
    const oldTripDay = this._trip;
    this._trip = new Trip(pointsData, this._pointsData);
    if (oldTripDay) {
      oldTripDay.getElement().replaceWith(this._trip.getElement());
      oldTripDay.removeElement();
    }

    this._refreshTotalCost(pointsData);
    this._refreshPoints(points, pointsData);
  }

  _refreshTotalCost(pointsData) {
    this._totalCost.textContent = getTotalCost(pointsData);
  }

  _refreshPoints(points, pointsData) {
    points.forEach((newPoint, index) => {
      const pointParent = this._getPointParent(pointsData[index]);
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
    this._refreshTrip(this._pointsData);
  }

  _renderPoint(pointData) {
    const pointController = new PointController(pointData, this._onDataChange, this._onChangeView);
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

  _onDataChange(newPointData, oldPointData) {
    if (newPointData) {
      this._pointsData[this._pointsData.findIndex((pointData) => pointData === oldPointData)] = newPointData;
    } else {
      this._pointsData = this._pointsData.filter((pointData) => pointData !== oldPointData);
    }
    this._refreshTrip(this._pointsData);
  }
}
