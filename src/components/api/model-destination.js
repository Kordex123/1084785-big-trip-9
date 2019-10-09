import ModelPicture from "./model-picture";

export default class ModelDestination {
  constructor(destination) {
    this.name = destination[`name`];
    this.description = destination[`description`];
    this.pictures = ModelPicture.parsePictures(destination[`pictures`]);
  }

  static parseDestination(destination) {
    return new ModelDestination(destination);
  }

  static parseDestinations(destination) {
    return destination.map(ModelDestination.parseDestination);
  }
}
