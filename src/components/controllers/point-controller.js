import {Point} from "../point";
import {EditPoint} from "../edit-point";
import {Destinations, Events, Offer} from "../event-data";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

export class PointController {
  constructor(pointData, onDataChange, onChangeView, refreshTrip, removePoint) {
    this._pointData = pointData;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._pointView = new Point(this._pointData);
    this._editPoint = new EditPoint(this._pointData);
    this._refreshTrip = refreshTrip;
    this._removePoint = removePoint;

    this.init();
  }

  init() {

    flatpickr(this._editPoint.getElement().querySelector(`[name=event-start-time]`), {
      enableTime: true,
      dateFormat: `m.d.y H:i`,
      defaultDate: this._pointData._startDate,
    });

    flatpickr(this._editPoint.getElement().querySelector(`[name=event-end-time]`), {
      enableTime: true,
      dateFormat: `m.d.y H:i`,
      defaultDate: this._pointData._endDate,
    });

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._editPoint.getElement().replaceWith(this._pointView.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._editPoint.getElement().querySelector(`.event__input--destination`)
      .addEventListener(`change`, (event) => {
        const destinationName = event.target.value;
        let foundObjectByName = Destinations.find(({name}) => name === destinationName);

        this._editPoint._destination.description = foundObjectByName && foundObjectByName.description;
        this._editPoint._destination.pictures = foundObjectByName && foundObjectByName.pictures;
        this._editPoint._destination.name = destinationName;

        let oldEditPointElement = this._editPoint.getElement();
        this._editPoint.removeElement();
        // this._editPoint.getElement().replaceWith(newEditPoint.getElement());
        oldEditPointElement.parentElement.replaceChild(this._editPoint.getElement(), oldEditPointElement);
        oldEditPointElement = null;

        this.init();

        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._editPoint.getElement().querySelector(`.event__input--destination`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._editPoint.getElement().querySelectorAll(`.event__offer-selector`).forEach((offer) =>
      offer.addEventListener(`click`, (event) => {
        const offerCheckBox = event.currentTarget.querySelector(`.event__offer-checkbox`);
        offerCheckBox.checked = !offerCheckBox.checked;
      }));

    this._editPoint.getElement().querySelectorAll(`.event__type-input`).forEach((input) =>
      input.addEventListener(`click`, (event) => {
        const eventType = event.target.value;
        let foundTypeByValue = Offer.find(({type}) => type.toLowerCase() === eventType);
        this._editPoint._type = foundTypeByValue && foundTypeByValue.type;
        this._editPoint._additionalOptions = foundTypeByValue && foundTypeByValue.offers;
        let oldEditPointElement = this._editPoint.getElement();
        this._editPoint.removeElement();
        // this._editPoint.getElement().replaceWith(newEditPoint.getElement());
        oldEditPointElement.parentElement.replaceChild(this._editPoint.getElement(), oldEditPointElement);
        oldEditPointElement = null;

        this.init();

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
        const chosenOffers = Array.from(formData.entries())
          .filter((option) => option[0] === `event-offer`);
        const allOffers = Offer.find(({type}) => type === this._editPoint._type).offers;
        const entry = {
          destination: this._editPoint._destination,
          startDate: new Date(formData.get(`event-start-time`).toString()),
          endDate: new Date(formData.get(`event-end-time`).toString()),
          type: this._editPoint._type,
          price: formData.get(`event-price`),
          additionalOptions: chosenOffers
            .filter((option) => option[1] === `on`)
            .map((value, idx) => allOffers[idx])
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
        };
        Object.assign(this._pointData, entry);
        this._refreshTrip();
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


    this._editPoint.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {
        this._removePoint(this._pointData.id);
        this._pointView.removeElement();
        this._editPoint.removeElement();
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._pointView.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        this._pointView.getElement().replaceWith(this._editPoint.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._editPoint.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._editPoint.getElement().replaceWith(this._pointView.getElement());
      });

    return this._pointView;
  }

  _getDestination(name) {
    return Destinations.find((el) => el.name === name);
  }

  _getType(type) {
    return Object.values(Events).find((eventType) => eventType.toLowerCase() === type);
  }

  setDefaultView() {
    if (!this._pointView.getElement().parentElement) {
      this._editPoint.getElement().parentElement.replaceChild(this._pointView.getElement(), this._editPoint.getElement());
    }
  }
}
