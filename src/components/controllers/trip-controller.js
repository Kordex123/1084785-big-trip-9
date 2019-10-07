import {Trip} from "../trip";
import {Position, render} from "../utils/render-utils";
import {TripInfo} from "../trip-info";
import {getTotalCost} from "../event-data";
import {PointController} from "./point-controller";
import {TripTabsController} from "./trip-tabs-controller";
import {TripFiltersController} from "./trip-filters-controller";
import {SortController} from "./sort-controller";
import {ActionType, PointModes} from "../dict";
import {api} from "../api/api";
import {ModelPoint} from "../api/model-point";
import {StatisticsController} from "./statistics-controller";

export class TripController {
  constructor(tripPageMainSection, pointsData, offersDict, destinationDict) {
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._handleNewPointClick = this._handleNewPointClick.bind(this);
    this._refreshTrip = this._refreshTrip.bind(this);
    this._refreshStats = this._refreshStats.bind(this);
    this._refreshTotalCost = this._refreshTotalCost.bind(this);
    this._removePoint = this._removePoint.bind(this);

    this._tripPageMainSection = tripPageMainSection;
    this._offersDict = offersDict;
    this._destinationDict = destinationDict;
    this._pointsData = pointsData;
    this._sortController = new SortController(this._pointsData, this._refreshTrip);
    this._tripInfo = new TripInfo(this._pointsData);
    this._tripFiltersController = new TripFiltersController(this._pointsData, this._refreshTrip, this._refreshStats);
    this._statisticsController = new StatisticsController(this._tripPageMainSection.parentElement, this._pointsData, this._tripFiltersController);
    this._tripTabsController = new TripTabsController(this._tripPageMainSection, this._pointsData, this._statisticsController);
    this._subscriptions = [];

    this._init();
  }

  _init() {
    const tripInfoSection = document.querySelector(`.trip-main__trip-info`);
    const tripControlsSection = document.querySelector(`.trip-main__trip-controls h2:nth-child(2)`);
    this._totalCost = document.querySelector(`.trip-info__cost-value`);
    this._newPointButton = document.querySelector(`.trip-main__event-add-btn`);
    this._newPointButton.addEventListener(`click`, this._handleNewPointClick);

    render(tripInfoSection, this._tripInfo.getElement(), Position.AFTERBEGIN);
    render(tripControlsSection, this._tripTabsController._tripTabs.getElement(), Position.BEFOREBEGIN);
    render(tripControlsSection, this._tripFiltersController._tripFilters.getElement(), Position.AFTEREND);

    this._refreshTrip(this._pointsData);
  }

  _handleNewPointClick() {
    this._tripDaysList = document.querySelector(`.trip-days`);
    if (this._tripDaysList && !this._newPointButton.disabled) {
      this._subscriptions.forEach((subscription) => subscription());
      this._newPointButton.disabled = true;
      this._newPoint = this._renderNewPoint();
      render(this._tripDaysList, this._newPoint.getElement(), Position.BEFOREBEGIN);
    }
  }

  _refreshTrip(pointsData) {
    this._subscriptions = [];

    pointsData = pointsData.filter(this._tripFiltersController.getFilterFunction());
    pointsData.sort(this._sortController.getSortFunction());
    this._pointsData.sort(this._sortController.getSortFunction());

    const points = pointsData.map((point) => this._renderPoint(point));
    const oldTripDay = this._trip;
    this._trip = new Trip(pointsData, this._pointsData);
    if (oldTripDay) {
      oldTripDay.getElement().replaceWith(this._trip.getElement());
      oldTripDay.removeElement();
    } else {
      render(this._tripPageMainSection, this._trip.getElement(), Position.AFTEREND);
      render(this._tripPageMainSection, this._sortController._sort.getElement(), Position.AFTEREND);
    }

    this._refreshTotalCost(pointsData);
    this._refreshPoints(points, pointsData);
    this._onChangeView();
    this._tripTabsController.refreshTabs();
  }

  _refreshStats(pointsData) {
    this._statisticsController.refreshStats(pointsData);
    this._tripTabsController.refreshTabs();
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
    const pointController = new PointController(pointData, this._offersDict, this._destinationDict, this._onDataChange, this._onChangeView);
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
    return pointController._pointView;
  }

  _renderNewPoint() {
    const newPointData = {
      startDate: new Date(),
      endDate: new Date(),
      type: `taxi`,
      destination: this._destinationDict[0],
      price: 0,
      additionalOptions: []
    };

    const pointController = new PointController(newPointData, this._offersDict, this._destinationDict, this._onDataChange, this._onChangeView, PointModes.ADD);
    return pointController._editPoint;
  }

  _getPointParent(pointData) {
    const position = this._trip.getPointPosition(pointData);
    const day = this._trip.getElement().querySelectorAll(`.trip-days__item`)[position.dayNo];
    const pointParent = day.querySelectorAll(`.trip-events__item`)[position.itemNo];

    return pointParent;
  }

  _onChangeView() {
    this._newPointButton.disabled = false;
    this._removeNewPoint();
    this._subscriptions.forEach((subscription) => subscription());
  }

  _removeNewPoint() {
    if (!this._newPoint) {
      return;
    }
    let oldNewPointElement = this._newPoint.getElement();
    oldNewPointElement.remove();
    this._newPoint.removeElement();
    oldNewPointElement = null;
  }

  _onDataChange(actionType, pointData) {

    switch (actionType) {
      case ActionType.CREATE:
        api.createPoint({
          point: ModelPoint.toRAW(pointData),
        }).then(() => api.getAllPoints())
          .then((points) => {
            this._pointsData = points;
            this._refreshTrip(this._pointsData);
          });
        break;
      case ActionType.UPDATE:
        api.updatePoint({
          id: pointData.id,
          point: ModelPoint.toRAW(pointData),
        }).then(() => api.getAllPoints())
          .then((points) => {
            this._pointsData = points;
            this._refreshTrip(this._pointsData);
          });
        break;
      case ActionType.DELETE:
        api.deletePoint({
          id: pointData.id
        }).then(() => api.getAllPoints())
          .then((points) => {
            this._pointsData = points;
            this._refreshTrip(this._pointsData);
          });
        break;
    }
  }
}
