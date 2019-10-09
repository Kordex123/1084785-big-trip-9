import Trip from "../trip";
import Info from "../info";
import ModelPoint from "../api/model-point";
import TabsController from "./tabs-controller";
import PointController from "./point-controller";
import FiltersController from "./filters-controller";
import SortController from "./sort-controller";
import StatisticsController from "./statistics-controller";
import {Position, render} from "../utils/render-utils";
import {ActionType, PointMode} from "../dict";
import {api} from "../api/api";

export default class TripController {
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
    this._tripFiltersController = new FiltersController(this._pointsData, this._refreshTrip, this._refreshStats);
    this._statisticsController = new StatisticsController(this._tripPageMainSection.parentElement, this._pointsData, this._tripFiltersController);
    this._tripTabsController = new TabsController(this._tripPageMainSection, this._pointsData, this._statisticsController);
    this._subscriptions = [];

    this._init();
  }

  _init() {
    const tripControlsSection = document.querySelector(`.trip-main__trip-controls h2:nth-child(2)`);
    this._tripInfoSection = document.querySelector(`.trip-main__trip-info`);
    this._totalCost = document.querySelector(`.trip-info__cost-value`);
    this._noPointsMessage = document.querySelector(`.no-points`);
    this._newPointButton = document.querySelector(`.trip-main__event-add-btn`);
    this._newPointButton.addEventListener(`click`, this._handleNewPointClick);

    this._refreshTrip(this._pointsData);

    render(tripControlsSection, this._tripTabsController._tripTabs.getElement(), Position.BEFOREBEGIN);
    render(tripControlsSection, this._tripFiltersController._tripFilters.getElement(), Position.AFTEREND);
  }

  _handleNewPointClick() {
    this._tripDays = document.querySelector(`.trip-days`);
    if (this._tripDays && !this._newPointButton.disabled) {
      this._subscriptions.forEach((subscription) => subscription());
      this._newPointButton.disabled = true;

      const newPointController = this._renderNewPoint();
      document.addEventListener(`keydown`, newPointController.onAddEditPointEscape);

      this._newPoint = newPointController._editPoint;
      render(this._tripDays, this._newPoint.getElement(), Position.BEFOREBEGIN);
      this._toggleNoPointsMessage(false);
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
      this._hideLoader();
      render(this._tripPageMainSection, this._trip.getElement(), Position.AFTEREND);
      render(this._tripPageMainSection, this._sortController._sort.getElement(), Position.AFTEREND);
    }

    this._refreshInfo(this._pointsData);
    this._refreshTotalCost(pointsData);
    this._refreshPoints(points, pointsData);
    this._onChangeView();
    this._tripTabsController.refreshTabs();
    this._refreshStats(pointsData);
  }

  _refreshInfo(pointsData) {
    const oldTripInfo = this._tripInfo;
    this._tripInfo = new Info(pointsData);
    if (oldTripInfo) {
      oldTripInfo.getElement().replaceWith(this._tripInfo.getElement());
      oldTripInfo.removeElement();
    } else {
      render(this._tripInfoSection, this._tripInfo.getElement(), Position.AFTERBEGIN);
    }
  }

  _refreshStats(pointsData) {
    this._statisticsController.refreshStats(pointsData);
    this._tripTabsController.refreshTabs();
  }

  _refreshTotalCost(pointsData) {
    this._totalCost.textContent = this._getTotalCost(pointsData);
  }

  _getTotalCost(events) {
    return events.reduce((total, {price, additionalOptions}) => {
      total += price;
      for (let offer of additionalOptions) {
        total += (offer.price);
      }
      return total;
    }, 0);
  }

  _toggleNoPointsMessage(isShown) {
    this._noPointsMessage.style.display = isShown ? `block` : `none`;
  }

  _refreshPoints(points, pointsData) {
    this._toggleNoPointsMessage(!points.length);

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

    const pointController = new PointController(newPointData, this._offersDict, this._destinationDict, this._onDataChange, this._onChangeView, PointMode.ADD);
    return pointController;
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
    this._toggleNoPointsMessage(!this._pointsData.length);
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

  _hideLoader() {
    const loader = document.querySelector(`.trip-loading`);
    loader.style.display = `none`;
  }

  _onDataChange(actionType, pointData, options) {
    switch (actionType) {
      case ActionType.CREATE:
        api.createPoint({
          point: ModelPoint.toRAW(pointData),
          options
        })
          .then(() => api.getAllPoints())
          .then((points) => {
            this._pointsData = points;
            this._refreshTrip(this._pointsData);
          });
        break;
      case ActionType.UPDATE:
        api.updatePoint({
          id: pointData.id,
          point: ModelPoint.toRAW(pointData),
          options
        }).then(() => api.getAllPoints())
          .then((points) => {
            this._pointsData = points;
            this._refreshTrip(this._pointsData);
          });
        break;
      case ActionType.DELETE:
        api.deletePoint({
          id: pointData.id,
          options
        }).then(() => api.getAllPoints())
          .then((points) => {
            this._pointsData = points;
            this._refreshTrip(this._pointsData);
          });
        break;
    }
  }
}
