'use strict';

class Material {

  constructor(name) {
    this.name = name || '';

    this.illum = 0;

    this.ambientTextureImageURL = null;

    this.Ka = { red: 0, green: 0, blue: 0 };
    this.Kd = { red: 0, green: 0, blue: 0 };
    this.Ks = { red: 0, green: 0, blue: 0 };
  }

  getName() {
    return this.name;
  }

  setIllum(illumModelNumber) {
    this.illum = illumModelNumber;
  }

  getIllum() {
    return this.illum;
  }

  setAmbientColor(color) {
    this.Ka = color;
  }

  getAmbientColor() {
    return this.Ka;
  }

  setDiffuseColor(color) {
    this.Kd = color;
  }

  getDiffuseColor() {
    return this.Kd;
  }

  setAmbientTextureImageURL(textureImageURL) {
    this.ambientTextureImageURL = textureImageURL;
  }

  getAmbientTextureImageURL() {
    return this.ambientTextureImageURL;
  }

}

module.exports = Material;