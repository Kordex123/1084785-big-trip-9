// import {ModelDestination} from "./model-destination";
// import {ModelOffer} from "./model-offer";
//
// export class ModelPoint {
//   constructor(data) {
//     // this.id = data[`id`];
//     this.startDate = new Date(data[`date_from`]);
//     this.endDate = new Date(data[`date_to`]);
//     // this.editMode = ?
//     this.type = data[`type`];
//     this.destination = new ModelDestination(data[`destination`]);
//     this.price = data[`base_price`];
//     this.isFavorite = Boolean(data[`is_favorite`]);
//     this.additionalOptions = data[`offers`].map((offer) => new ModelOffer(offer));
//   }
//
//   static parsePoint(data) {
//     return new ModelPoint(data);
//   }
//
//   static parsePoints(data) {
//     return data.map(ModelPoint.parsePoint);
//   }
//
//   toRAW() {
//     return {
//       'date_from': this.startDate,
//       'date_to': this.endDate,
//       'type': this.type,
//       'destination': this.destination,
//       'base_price': this.price,
//       'offers': this.additionalOptions,
//       // 'is_favorite': this.isFavorite;
//     };
//   }
// };
