import ModelDestination from "./model-destination";
import ModelOffer from "./model-offer";

export default class ModelPoint {
  constructor(point) {
    this.id = point[`id`];
    this.startDate = new Date(point[`date_from`]);
    this.endDate = new Date(point[`date_to`]);
    this.type = point[`type`];
    this.destination = ModelDestination.parseDestination(point[`destination`]);
    this.price = point[`base_price`];
    this.isFavorite = Boolean(point[`is_favorite`]);
    this.additionalOptions = ModelOffer.parseOffers(point[`offers`]);
  }

  static parsePoint(point) {
    return new ModelPoint(point);
  }

  static parsePoints(point) {
    return [].concat(point).map(ModelPoint.parsePoint);
  }

  static toRAW(modelPoint) {
    return {
      'date_from': modelPoint.startDate,
      'date_to': modelPoint.endDate,
      'type': modelPoint.type,
      'destination': modelPoint.destination,
      'base_price': modelPoint.price,
      'offers': ModelOffer.toRAWs(modelPoint.additionalOptions),
      'id': modelPoint.id,
      'is_favorite': modelPoint.isFavorite || false,
    };
  }
}
