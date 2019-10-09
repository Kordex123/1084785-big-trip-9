import Point from "../point";
import EditPoint from "../edit-point";
import {ActionType, PointMode} from "../dict";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import moment from "moment";


export default class PointController {
  constructor(pointData, offersDict, destinationDict, onDataChange, onChangeView, mode = PointMode.EDIT) {
    this._pointData = pointData;
    this._offersDict = offersDict;
    this._destinationDict = destinationDict;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._pointView = new Point(this._pointData);
    this._editPoint = new EditPoint(this._pointData, this._offersDict, this._destinationDict, mode);
    this._mode = mode;

    this.onAddEditPointEscape = this.onAddEditPointEscape.bind(this);
    this.init();
  }

  init() {

    const eventStartDatePicker = flatpickr(this._editPoint.getElement().querySelector(`[name=event-start-time]`), {
      enableTime: true,
      dateFormat: `m/d/y h:i`,
      defaultDate: this._pointData.startDate,
      enable: [(startDate) => !moment(startDate).isAfter(this._pointData.endDate)],
      maxDate: this._pointData.endDate
    });

    const eventEndDatePicker = flatpickr(this._editPoint.getElement().querySelector(`[name=event-end-time]`), {
      enableTime: true,
      dateFormat: `m/d/y h:i`,
      defaultDate: this._pointData.endDate,
      enable: [(endDate) => !moment(endDate).isBefore(moment(this._pointData.startDate).startOf(`day`))],
      minDate: this._pointData.startDate
    });

    eventStartDatePicker.config.onChange = [(startDate) => eventEndDatePicker.set(`minDate`, startDate[0])];
    eventEndDatePicker.config.onChange = [(endDate) => eventStartDatePicker.set(`maxDate`, endDate[0])];

    this._editPoint.getElement().querySelector(`.event__input--destination`)
      .addEventListener(`change`, (event) => {
        const destinationName = event.target.value;
        let foundObjectByName = this._destinationDict.find(({name}) => name === destinationName);

        if (foundObjectByName) {
          this._editPoint._destination.description = foundObjectByName && foundObjectByName.description;
          this._editPoint._destination.pictures = foundObjectByName && foundObjectByName.pictures;
          this._editPoint._destination.name = destinationName;
          this._refreshEditPoint();
        }
      });

    this._editPoint.getElement().querySelector(`.event__input--price`)
      .addEventListener(`change`, (event) => {
        const price = Number(event.target.value);
        if (this._isPositiveInteger(price)) {
          return;
        }
        this._editPoint._price = price;
      });

    this._editPoint.getElement().querySelector(`.event__input--destination`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, this.onAddEditPointEscape);
      });

    this._editPoint.getElement().querySelectorAll(`.event__offer-selector`).forEach((offer) =>
      offer.addEventListener(`click`, (event) => {
        const offerCheckBox = event.currentTarget.querySelector(`.event__offer-checkbox`);
        const isChecked = offerCheckBox.hasAttribute(`checked`);
        if (isChecked) {
          offerCheckBox.removeAttribute(`checked`);
        } else {
          offerCheckBox.setAttribute(`checked`, ``);
        }
      }));

    this._editPoint.getElement().querySelectorAll(`.event__type-input`).forEach((input) =>
      input.addEventListener(`click`, (event) => {
        const eventType = event.target.value;
        let foundTypeByValue = this._offersDict.find(({type}) => type.toLowerCase() === eventType);
        this._editPoint._type = foundTypeByValue && foundTypeByValue.type;
        this._editPoint._additionalOptions = foundTypeByValue && foundTypeByValue.offers;

        this._refreshEditPoint();
        document.addEventListener(`keydown`, this.onAddEditPointEscape);
      }));

    this._editPoint.getElement().querySelectorAll(`.event__input`).forEach((input) =>
      input.addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, this.onAddEditPointEscape);
      }));

    this._editPoint.getElement().querySelector(`.event__input--price`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, this.onAddEditPointEscape);
      });

    this._editPoint.getElement()
      .addEventListener(`submit`, (event) => {
        event.preventDefault();

        const formData = new FormData(this._editPoint.getElement());
        const allOffers = this._offersDict.find(({type}) => type === this._editPoint._type).offers;
        const chosenOffers = Array.from(this._editPoint.getElement().querySelectorAll(`.event__offer-checkbox`))
          .map((checkbox, index) => ({isChecked: checkbox.hasAttribute(`checked`), index}))
          .filter(({isChecked}) => isChecked)
          .map(({index}) => allOffers[index]);
        const newPointData = Object.assign({}, this._pointData, {
          destination: this._editPoint._destination,
          startDate: new Date(formData.get(`event-start-time`).toString()),
          endDate: new Date(formData.get(`event-end-time`).toString()),
          type: this._editPoint._type,
          price: this._editPoint._price,
          additionalOptions: chosenOffers,
          isFavorite: formData.get(`event-favorite`) === `on`,
        });

        this._onDataChange(this._mode === PointMode.ADD ? ActionType.CREATE : ActionType.UPDATE, newPointData, {
          handleError: this._editPoint.handleError,
          block: this._editPoint.block
        });
        document.removeEventListener(`keydown`, this.onAddEditPointEscape);

      });

    this._editPoint.getElement().querySelector(`[name=event-start-time]`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, this.onAddEditPointEscape);
      });

    this._editPoint.getElement().querySelector(`[name=event-end-time]`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, this.onAddEditPointEscape);
      });

    this._editPoint.getElement().querySelector(`[name=event-end-time]`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, this.onAddEditPointEscape);
      });

    this._editPoint.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {
        this._editPoint._element.classList.remove(`error-border`);
        if (this._mode === PointMode.EDIT) {
          this._onDataChange(ActionType.DELETE, this._pointData, {
            handleError: this._editPoint.handleError,
            block: this._editPoint.block
          });
        } else {
          this._onChangeView();
        }
        document.removeEventListener(`keydown`, this.onAddEditPointEscape);
      });

    this._pointView.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        this._pointView.getElement().replaceWith(this._editPoint.getElement());
        document.addEventListener(`keydown`, this.onAddEditPointEscape);
      });

    if (this._mode !== PointMode.ADD) {
      this._editPoint.getElement()
        .querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, () => {
          this._editPoint.getElement().replaceWith(this._pointView.getElement());
        });
    }

    return this._pointView;
  }

  _refreshEditPoint() {
    let oldEditPointElement = this._editPoint.getElement();
    this._editPoint.removeElement();
    oldEditPointElement.parentElement.replaceChild(this._editPoint.getElement(), oldEditPointElement);
    oldEditPointElement = null;

    this.init();
  }

  onAddEditPointEscape(event) {
    if (event.key === `Escape` || event.key === `Esc`) {
      this._onChangeView();
      document.removeEventListener(`keydown`, this.onAddEditPointEscape);
    }
  }

  setDefaultView() {
    this._editPoint._element.classList.remove(`error-border`);

    if (!this._pointView.getElement().parentElement) {
      this._editPoint.getElement().replaceWith(this._pointView.getElement());
    }
  }

  _isPositiveInteger(price) {
    return (Number.isNaN(price) || !Number.isInteger(price) || price) < 0;
  }
}
