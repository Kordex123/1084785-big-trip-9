export class ModelOffer {
  constructor(data) {
    this.title = data[`title`];
    this.price = data[`price`];
  }

  static parseOffer(data) {
    return new ModelOffer(data);
  }

  static parseOffers(data) {
    return data.map(ModelOffer.parseOffer);
  }

  static toRAW(offerData) {
    return {
      'title': offerData.title,
      'price': offerData.price,
    };
  }

  static toRAWs(offerDataList) {
    return offerDataList.map(ModelOffer.toRAW);
  }
}
