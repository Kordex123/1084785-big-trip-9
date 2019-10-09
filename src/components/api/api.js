import ModelPoint from "./model-point";
import ModelDestination from "./model-destination";
import ModelOffers from "./model-offers";

const AUTHORIZATION = `Basic A1B1C1D1E1F1G1H1I1`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip/`;

export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getAllPoints() {
    return this._load({url: `points`})
      .then(this._toJSON)
      .then(ModelPoint.parsePoints);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(this._toJSON)
      .then(ModelDestination.parseDestinations);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(this._toJSON)
      .then(ModelOffers.parseOffers);
  }

  createPoint({point, options}) {
    options.block(`save`);
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`}),
      options
    })
      .then(this._toJSON)
      .then(ModelPoint.parsePoint);
  }

  updatePoint({id, point, options}) {
    options.block(`save`);
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`}),
      options
    })
      .then(this._toJSON)
      .then(ModelPoint.parsePoints);
  }

  deletePoint({id, options}) {
    options.block(`delete`);
    return this._load({url: `points/${id}`, method: Method.DELETE, options});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers(), options = {}}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(this._checkStatus, options.handleError || this._defaultErrorHandler);
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  _toJSON(response) {
    return response.clone().json();
  }

  _defaultErrorHandler(error) {
    throw error;
  }
}

export const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
