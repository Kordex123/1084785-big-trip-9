import {ModelDestination} from "./model-destination";
import {ModelOffer} from "./model-offer";

export class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.startDate = new Date(data[`date_from`]);
    this.endDate = new Date(data[`date_to`]);
    this.type = data[`type`];
    this.destination = ModelDestination.parseDestination(data[`destination`]);
    this.price = data[`base_price`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    // this.additionalOptions = data[`offers`].map((offer) => new ModelOffer(offer));
    this.additionalOptions = ModelOffer.parseOffers(data[`offers`]);
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return [].concat(data).map(ModelPoint.parsePoint);
  }

  static toRAW(pointData) {
    return {
      'date_from': pointData.startDate,
      'date_to': pointData.endDate,
      'type': pointData.type,
      'destination': pointData.destination,
      'base_price': pointData.price,
      'offers': ModelOffer.toRAWs(pointData.additionalOptions),
      'id': pointData.id,
      'is_favorite': pointData.isFavorite || false,
    };
  }
}
