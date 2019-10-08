export class ModelPicture {
  constructor(data) {
    this.src = data[`src`];
    this.description = data[`description`];
  }

  static parsePicture(data) {
    return new ModelPicture(data);
  }

  static parsePictures(data) {
    return data.map(ModelPicture.parsePicture);
  }

  static toRAW(picture) {
    return {
      'src': picture.src,
      'description': picture.description,
    };
  }

  static toRAWs(pictures) {
    return pictures.map(ModelPicture.toRAW);
  }
}
