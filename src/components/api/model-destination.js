// import {ModelPicture} from "./model-picture";
//
// export class ModelDestination {
//   constructor(data) {
//     this.name = data[`name`];
//     this.description = data[`description`];
//     this.pictures = data[`pictures`].map(ModelPicture.parsePictures);
//   }
//
//   static parseDestination(data) {
//     return new ModelDestination(data);
//   }
//
//   static parseDestinations(data) {
//     return data.map(ModelDestination.parseDestination());
//   }
//
//   toRAW() {
//     return {
//       'name': this.name,
//       'description': this.description,
//       'pictures': [this.pictures],
//     };
//   }
// }
