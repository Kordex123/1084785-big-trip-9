import {ModelPicture} from "./model-picture";

export class ModelDestination {
  constructor(data) {
    this.name = data[`name`];
    this.description = data[`description`];
    this.pictures = ModelPicture.parsePictures(data[`pictures`]);
  }

  static parseDestination(data) {
    return new ModelDestination(data);
  }

  static parseDestinations(data) {
    return data.map(ModelDestination.parseDestination);
  }

  static toRAW(description) {
    return {
      'name': description.name,
      'description': description.description,
      'pictures': ModelPicture.toRAWs(description.pictures)
    };
  }
}
