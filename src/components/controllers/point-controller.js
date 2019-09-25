import {Point} from "../point";
import {EditPoint} from "../edit-point";
import {Destinations} from "../event-data";

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
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._editPoint.getElement().replaceWith(this._pointView.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._editPoint.getElement().querySelector(`.event__input--destination`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

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

    this._editPoint.getElement().querySelector(`[name=event-start-time]`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._editPoint.getElement().querySelector(`[name=event-end-time]`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._editPoint.getElement().querySelector(`.event__input--price`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._editPoint.getElement().querySelector(`.event__input--destination`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    // this._editPoint.getElement().querySelector(`.event__input--destination`)
    //   .addEventListener(`input`, (event) => {
    //     this._pointData.destination.name = event.target.value;
    //   });

    this._editPoint.getElement()
      .addEventListener(`submit`, (event) => {
        event.preventDefault();

        const formData = new FormData(this._editPoint.getElement());
        const entry = {
          destination: this._getDestination(formData.get(`event-destination`)),
          startDate: new Date(formData.get(`event-start-time`).toString()),
          endDate: new Date(formData.get(`event-end-time`).toString()),
          price: formData.get(`event-price`),
          additionalOptions: Array.from(formData.entries()).reduce((chosenOptions, optionName) => {
            const prefix = `event-offer-`;
            if (optionName[0].startsWith(prefix)) {
              const optionId = optionName[0].substring(prefix.length);
              const option = chosenOptions.find((el) => el.id === optionId);
              chosenOptions.push(option);
            }
            return chosenOptions;
          }, [])
        };
        Object.assign(this._pointData, entry);
        this._refreshTrip();
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

  setDefaultView() {
    if (!this._pointView.getElement().parentElement) {
      this._editPoint.getElement().parentElement.replaceChild(this._pointView.getElement(), this._editPoint.getElement());
    }
  }
}
