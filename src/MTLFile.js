'use strict';

const Material = require('./Material');


class MTLFile {

  constructor(fileContents) {
    this._reset();
    this.fileContents = fileContents;
  }

  _reset() {
    this.materials = [];
    this.currentMaterial = null;
    this.lineNumber = 1;
    this.filename = '';
  }

  parse(defaultMaterialName = 'default') {
    this._reset();

    this.defaultMaterialName = defaultMaterialName;

    const lines = this.fileContents.split("\n");

    lines.forEach((line, index) => {

      this.lineNumber = (index + 1);

      const lineItems = this._stripComments(line).replace(/\s\s+/g, ' ').trim().split(' ');

      if (lineItems.length == 0 || !lineItems[0]) {
        return; // Skip blank lines
      }

      switch(lineItems[0].toLowerCase())
      {
        case 'newmtl':  // Starts a new material, assigns a name to it
          this._parseNewMTL(lineItems);
          break;

        case 'illum': // Specifies which Illumination model is to be used when rendering the current material. (eg. illum 2)
          // Abbreviations:
          //  N    Unit surface normal
          //  Ia   Itensity of the ambient light
          //  ls   # of lights
          //  Lj   Light direction (vector) of light j
          //  Ij   Light intensity (scalar) of light j

          // Illumination ModeLs:
          //  0:  Constant color   (color = Kd)

          //  1:  Diffuse illumination model (using Lambertian shading).
          //        color = KaIa + Kd { SUM j=1..ls, (N * Lj)Ij }

          //  2:  Diffuse and specular illumination model using Lambertian shading,
          //      and Blinn's interpretation of Phong's specular illumination model.

          //        color = KaIa 
          //          + Kd { SUM j=1..ls, (N*Lj)Ij }
          //          + Ks { SUM j=1..ls, ((H*Hj)^Ns)Ij }
          this._parseIllum(lineItems);
          break;
        case 'ka': // (Ka) - Ambient color of material
          this._parseKa(lineItems);
          break;
        case 'kd': // (Kd) - Difffuse reflectance
          this._parseKd(lineItems);
          break;
        case 'ks': // (Ks) - Specular reflectance
          this._parseKs(lineItems);
          break;

        case 'tf': // Transmission filter
          this._parseTF(lineItems);
          break;
        case 'ns': // (Ns) - Specular Exponent
          this._parseNs(lineItems);
          break;
        case 'ni': // (Ni) - 
          this._parseNi(lineItems);
          break;
        case 'd': // Controls how the current material dissolves (becomes transparent)
          this._parseD(lineItems);
          break;
        case 'sharpness':
          this._parseSharpness(lineItems);
          break;

        case 'map_ka': //
          this._parseMapKa(lineItems);
          break;
        case 'map_kd': //
          this._parseMapKd(lineItems);
          break;
        case 'map_ks':
          this._parseMapKs(lineItems);
          break;
        case 'map_ns':
          this._parseMapNs(lineItems);
          break;

        case 'disp':
          this._parseDisp(lineItems);
          break;
        case 'decal':
          this._parseDecal(lineItems);
          break;
        case 'bump':
          this._parseBump(lineItems);
          break;

        case 'refl': // Reflection Map Statement
          this._parseRefl(lineItems);
          break;

        default:
          this._fileError(`Unrecognized statement: ${lineItems[0]}`);
      }
    });

    return this.materials;
  }

  _stripComments(lineString) {
    let commentIndex = lineString.indexOf('#');
    if(commentIndex > -1)
      return lineString.substring(0, commentIndex);
    else
      return lineString;
  }

  _getCurrentMaterial() {
    if (!this.currentMaterial) {
      this.currentMaterial = new Material(this.defaultMaterialName);
      this.materials.push(this.currentMaterial);
    }
    return this.currentMaterial;
  }

  // newmtl material_name
  _parseNewMTL(lineItems) {
    if (lineItems.length < 2) {
      throw 'newmtl statement must specify a name for the maerial (eg, newmtl brickwall)';
    }
    const newMat = new Material(lineItems[1]);
    this.materials.push(newMat);
    this.currentMaterial = newMat;
  }

  _parseIllum(lineItems) {
    if (lineItems.length < 2) {
      this._fileError('to few arguments, expected: illum <number>');
    }
    this._getCurrentMaterial().setIllum(parseInt(lineItems[1]));
  }

  // Ka r g b         <- currently only this syntax is supported
  // Ka spectral file.rfl factor
  // Ka xyz x y z
  _parseKa(lineItems) {
    const color = this._parseKStatementRGB(lineItems);
    this._getCurrentMaterial().setAmbientColor(color);
  }

  // Kd r g b         <- currently only this syntax is supported
  // Kd spectral file.rfl factor
  // Kd xyz x y z
  _parseKd(lineItems) {
    this._notImplemented('Kd');
  }

  // Ks r g b
  // Ks spectral file.rfl factor
  // Ks xyz x y z
  _parseKs(lineItems) {
    this._notImplemented('Ks');
  }

  // extracts the rgb values from a "Ka/Kd/Ks r g b" statement
  _parseKStatementRGB(lineItems) {
    if (lineItems.length < 4) {
      this._fileError('to few arguments, expected: Ka/Kd/Ks keyword followed by: r g b values');
    }
    if (lineItems[1].toLowerCase() == 'spectral') {
      this._notImplemented('Ka spectral <filename> <factor>');
    } else if (lineItems[1].toLowerCase() == 'xyz') {
      this._notImplemented('Ka xyz <x> <y> <z>');
    }

    return {
      red: parseFloat(lineItems[1]),
      green: parseFloat(lineItems[2]),
      blue: parseFloat(lineItems[3])
    };
  }

  _parseTF(lineItems) {
    this._notImplemented('tf');
  }

  // ns 500
  // Defines how focused the specular highlight is,
  // typically in the range of 0 to 1000.
  _parseNS(lineItems) {
    this._notImplemented('Ns');
  }

  _parseNi(lineItems) {
    this._notImplemented('Ni');
  }

  // d factor
  // d -halo factor
  // Controls how much the material dissolves (becomes transparent).
  _parseD(lineItems) {
    this._notImplemented('d');
  }

  _parseSharpness(lineItems) {
    this._notImplemented('sharpness');
  }

  // map_Ka [options] textureFile
  // map_Ka -s 1 1 1 -o 0 0 0 -mm 0 1 file.mpc
  _parseMapKa(lineItems) {
    if (lineItems.length < 2) {
      this._fileError('to few arguments, expected: map_ka <textureImageFile>');
    }
    // TODO parse options (lineItems[1] to lineItems[lineItems.length - 2])
    const lastLineItem = lineItems[lineItems.length - 1];
    this._getCurrentMaterial().setAmbientTextureImageURL(lastLineItem);
  }

  // map_Kd [options] textureFile
  _parseMapKd(lineItems) {
    this._notImplemented('map_Kd');
  }

  _parseMapNs(lineItems) {
    this._notImplemented('map_Ns');
  }

  _parseDisp(lineItems) {
    this._notImplemented('disp');
  }

  _parseDecal(lineItems) {
    this._notImplemented('decal');
  }

  _parseBump(lineItems) {
    this._notImplemented('bump');
  }

  _parseRefl(lineItems) {
    this._notImplemented('bump');
  }

  _notImplemented(message) {
    console.warn(`MTL file statement not implemented: ${message}`);
  }

  _fileError(message) {
    const file = this.filename ? `File: ${this.filename}` : '';
    const material = `Material: ${this.currentMaterial.getName()}`;
    const line = `Line: ${this.lineNumber}`;
    const errorMessage = `MTL file format error (${file}  ${material}  ${line}): ${message}`;
    throw errorMessage;
  }

}

module.exports = MTLFile;