import {Point} from "./components/point";
import {getEvents} from "./components/event-data";
import {getTotalCost} from "./components/event-data";
import {EditPoint} from "./components/edit-point";
import {Position, render} from "./components/utils/render-utils";
import {TripInfo} from "./components/trip-info";
import {TripTabs} from "./components/trip-tabs";
import {TripFilters} from "./components/trip-filters";
import {Trip} from "./components/trip";
import {TripSort} from "./components/trip-sort";

const pointMock = getEvents();

const tripInfoSection = document.querySelector(`.trip-main__trip-info`);
const tripControlsSection = document.querySelector(`.trip-main__trip-controls h2:nth-child(2)`);
const tripPageMainSection = document.querySelector(`.page-body__page-main h2:nth-child(1)`);
const totalCost = document.querySelector(`.trip-info__cost-value`);

const renderPoint = (pointData) => {
  const point = new Point(pointData);
  const editPoint = new EditPoint(pointData);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      editPoint.getElement().replaceWith(point.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  editPoint.getElement().querySelector(`.event__input--destination`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  editPoint.getElement().querySelector(`[name=event-start-time]`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  editPoint.getElement().querySelector(`[name=event-end-time]`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  editPoint.getElement().querySelector(`.event__input--price`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  editPoint.getElement().querySelector(`.event__input--destination`)
    .addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  editPoint.getElement().querySelector(`.event__input--destination`)
    .addEventListener(`input`, (event) => {
      pointData.destination.name = event.target.value;
    });

  editPoint.getElement()
    .addEventListener(`submit`, (event) => {
      event.preventDefault();
      refreshTrip();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  editPoint.getElement()
    .querySelector(`.event__reset-btn`)
    .addEventListener(`click`, () => {
      removePoint(pointData.id);
      point.removeElement();
      editPoint.removeElement();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  point.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      point.getElement().replaceWith(editPoint.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  editPoint.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      editPoint.getElement().replaceWith(point.getElement());
    });

  return point;
};

let points = pointMock.map((point) => renderPoint(point));
let trip = new Trip(points);

export const removePoint = (pointId) => {
  const indexToRemove = pointMock.findIndex((p) => p.id === pointId);
  pointMock.splice(indexToRemove, 1);
  refreshTrip();
};

export const refreshTrip = () => {
  points = pointMock.map((point) => renderPoint(point));
  const oldTrip = trip;
  trip = new Trip(points);
  oldTrip.getElement().replaceWith(trip.getElement());
  oldTrip.removeElement();
  refreshPoints(points);
};

render(tripInfoSection, new TripInfo().getElement(), Position.AFTERBEGIN);
render(tripControlsSection, new TripTabs().getElement(), Position.BEFOREBEGIN);
render(tripControlsSection, new TripFilters().getElement(), Position.AFTEREND);
render(tripPageMainSection, trip.getElement(), Position.AFTEREND);
render(tripPageMainSection, new TripSort().getElement(), Position.AFTEREND);
totalCost.textContent = getTotalCost(pointMock);

const refreshPoints = (newPoints) => {
  newPoints.forEach((newPoint) => {
    const position = trip.getPointPosition(newPoint);
    const day = trip.getElement().querySelectorAll(`.trip-days__item`)[position.dayNo];
    const pointParent = day.querySelectorAll(`.trip-events__item`)[position.itemNo];
    if (pointParent.hasChildNodes()) {
      pointParent.replaceChild(newPoint.getElement(), pointParent.firstElementChild);
    } else {
      pointParent.appendChild(newPoint.getElement());
    }
  });
};

refreshPoints(points);
