import {ModelOffer} from "./model-offer";

export class ModelOffers {
  constructor(data) {
    this.type = data[`type`];
    // this.offers = data[`offers`].map(ModelOffer.parseOffer);
    this.offers = ModelOffer.parseOffers(data[`offers`]);
  }

  static parseOffer(data) {
    return new ModelOffers(data);
  }

  static parseOffers(data) {
    return data.map(ModelOffers.parseOffer);
  }

  static toRAW(offersData) {
    return {
      'type': offersData.type,
      'offers': ModelOffer.toRAWs(offersData.offers),
    };
  }

  static toRAWs(offersDataList) {
    return offersDataList.map(ModelOffers.toRAW);
  }
}
