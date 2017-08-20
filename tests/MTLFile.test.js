'use strict';

jest.dontMock('../src/MTLFile');

const MTLFile = require('../src/MTLFile');


describe('MTLFile', () => {

  describe('Default Material', () => {
    it('creates a material called "default" when no material name is set through an newmtl statement or the defaultMaterial arg', () => {
      const materials = new MTLFile('ka 0 0 0\n').parse();
      expect(materials.length).toBe(1);
      expect(materials[0].name).toBe('default');
    });

    it('allows you to specify the default material name via the defaultMaterialName argument to parse()', () => {
      const materials = new MTLFile('ka 0 0 0\n').parse('BrickWall');
      expect(materials.length).toBe(1);
      expect(materials[0].name).toBe('BrickWall');
    })
  });

  describe('newmlt Statements', () => {
    it('creates a new material with the specified name', () => {
      const materials = new MTLFile('ka 0 0 0\nnewmtl newMat\nka 0 0 0').parse();
      expect(materials.length).toBe(2);
      expect(materials[1].name).toBe('newMat');
    });
  });

  describe('illum Statements', () => {
    it('sets the illumination model # for the current material', () => {
      const materials = new MTLFile('illum 3').parse();
      expect(materials[0].illum).toBe(3);
    });
  });

  describe('Ka Statements', () => {
    describe('Ka R G B', () => {
      it('sets the ambient color to the given RGB values', () => {
        const materials = new MTLFile('Ka 0.1 0.2 0.3').parse();
        expect(materials[0].Ka).toEqual({ method: 'rgb', red: 0.1, green: 0.2, blue: 0.3 });
      });
    });
  });

  describe('map_Ka Statements', () => {
    describe('map_Ka [options] textureFile', () => {
      it('sets the ambient texture file to the given path', () => {
        const materials = new MTLFile('map_Ka folder/file.png').parse();
        expect(materials[0].map_Ka.file).toBe('folder/file.png');
      });
    });
  });
});