// export class ModelOffer {
//   constructor(data) {
//     this.title = data[`title`];
//     this.price = data[`price`];
//   }
//
//   static parseOffer(data) {
//     return new ModelOffer(data);
//   }
//
//   static parseOffers(data) {
//     return data.map(ModelOffer.parseOffer);
//   }
//
//   toRAW() {
//     return {
//       'title': this.title,
//       'price': this.price,
//     };
//   }
// }
