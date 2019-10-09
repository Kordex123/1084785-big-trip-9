export default class ModelOffer {
  constructor(offer) {
    this.title = offer[`title`];
    this.price = offer[`price`];
  }

  static parseOffer(offer) {
    return new ModelOffer(offer);
  }

  static parseOffers(offer) {
    return offer.map(ModelOffer.parseOffer);
  }

  static toRAW(offerModel) {
    return {
      'title': offerModel.title,
      'price': offerModel.price,
    };
  }

  static toRAWs(offerModelList) {
    return offerModelList.map(ModelOffer.toRAW);
  }
}
