import ModelOffer from "./model-offer";

export default class ModelOffers {
  constructor(offers) {
    this.type = offers[`type`];
    this.offers = ModelOffer.parseOffers(offers[`offers`]);
  }

  static parseOffer(offers) {
    return new ModelOffers(offers);
  }

  static parseOffers(offers) {
    return offers.map(ModelOffers.parseOffer);
  }
}
