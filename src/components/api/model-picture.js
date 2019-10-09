export default class ModelPicture {
  constructor(picture) {
    this.src = picture[`src`];
    this.description = picture[`description`];
  }

  static parsePicture(picture) {
    return new ModelPicture(picture);
  }

  static parsePictures(picture) {
    return picture.map(ModelPicture.parsePicture);
  }
}
