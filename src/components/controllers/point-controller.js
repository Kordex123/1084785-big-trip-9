import {Point} from "../point";
import {EditPoint} from "../edit-point";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import moment from "moment";
import {ActionType, PointModes} from "../dict";

export class PointController {
  constructor(pointData, offersDict, destinationDict, onDataChange, onChangeView, mode = PointModes.EDIT) {
    this._pointData = pointData;
    this._offersDict = offersDict;
    this._destinationDict = destinationDict;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._pointView = new Point(this._pointData);
    this._editPoint = new EditPoint(this._pointData, this._offersDict, this._destinationDict, mode);
    this._mode = mode;

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

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._editPoint.getElement().replaceWith(this._pointView.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

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
        if (Number.isNaN(price) || !Number.isInteger(price) || price < 0) {
          alert(`Please provide integer positive number or 0`); // eslint-disable-line no-alert
          return;
        }
        this._editPoint._price = price;
      });

    this._editPoint.getElement().querySelector(`.event__input--destination`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
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
        document.addEventListener(`keydown`, onEscKeyDown);
      }));

    this._editPoint.getElement().querySelector(`.event__input--price`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    // this._editPoint.getElement().querySelector(`.event__input--destination`)
    //   .addEventListener(`blur`, () => {
    //     document.addEventListener(`keydown`, onEscKeyDown);
    //   });

    // this._editPoint.getElement().querySelector(`.event__input--destination`)
    //   .addEventListener(`input`, (event) => {
    //     this._pointData.destination.name = event.target.value;
    //   });

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
          // .reduce((chosenOptions, option, idx) => {
          //   if (option[1] === `on`) {
          //     chosenOptions.push(offers[idx]);
          //   }
          //   return chosenOptions;
          // }, [])
          // additionalOptions: Array.from(formData.entries()).reduce((chosenOptions, optionName) => {
          //   const prefix = `event-offer-`;
          //   if (optionName[0].startsWith(prefix)) {
          //     const optionId = optionName[0].substring(prefix.length);
          //     const option = chosenOptions.find((el) => el.id === optionId);
          //     chosenOptions.push(option);
          //   }
          //   return chosenOptions;
          // }, [])
        });

        this._onDataChange(this._mode === PointModes.ADD ? ActionType.CREATE : ActionType.UPDATE, newPointData);
        document.removeEventListener(`keydown`, onEscKeyDown);

      });

    this._editPoint.getElement().querySelector(`[name=event-start-time]`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._editPoint.getElement().querySelector(`[name=event-end-time]`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._editPoint.getElement().querySelector(`[name=event-end-time]`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._editPoint.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {
        if (this._mode === PointModes.EDIT) {
          this._onDataChange(ActionType.DELETE, this._pointData);
        } else {
          this._onChangeView();
        }
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._pointView.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        this._pointView.getElement().replaceWith(this._editPoint.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    if (this._mode !== PointModes.ADD) {
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
    // this._editPoint.getElement().replaceWith(newEditPoint.getElement());
    oldEditPointElement.parentElement.replaceChild(this._editPoint.getElement(), oldEditPointElement);
    oldEditPointElement = null;

    this.init();
  }

  setDefaultView() {
    /* if (this._mode === PointModes.ADD) {
      this._editPoint.getElement().remove();
    } else */ if (!this._pointView.getElement().parentElement) {
      this._editPoint.getElement().parentElement.replaceChild(this._pointView.getElement(), this._editPoint.getElement());
    }
  }
}
