import { getStringFromTypedArray, I3dmParser } from "../../Source/Cesium.js";
import Cesium3DTilesTester from "../Cesium3DTilesTester.js";

describe(
  "Scene/I3dmParser",
  function () {
    it("throws with undefined arrayBuffer", function () {
      expect(function () {
        I3dmParser.parse(undefined);
      }).toThrowDeveloperError();
    });

    it("throws with invalid version", function () {
      var arrayBuffer = Cesium3DTilesTester.generateInstancedTileBuffer({
        version: 2,
      });
      expect(function () {
        I3dmParser.parse(arrayBuffer);
      }).toThrowRuntimeError();
    });

    it("throws if there is no feature table json", function () {
      var arrayBuffer = Cesium3DTilesTester.generateInstancedTileBuffer({
        featureTableJson: {},
      });
      expect(function () {
        I3dmParser.parse(arrayBuffer);
      }).toThrowRuntimeError();
    });

    it("throws with invalid glTF format", function () {
      var arrayBuffer = Cesium3DTilesTester.generateInstancedTileBuffer({
        gltfFormat: 2,
      });
      expect(function () {
        I3dmParser.parse(arrayBuffer);
      }).toThrowRuntimeError();
    });

    it("throws if there is no glTF", function () {
      var arrayBuffer = Cesium3DTilesTester.generateInstancedTileBuffer({
        gltfUri: "",
      });
      expect(function () {
        I3dmParser.parse(arrayBuffer);
      }).toThrowRuntimeError();
    });

    it("prints deprecation warning if glTF is not 4-byte aligned", function () {
      spyOn(I3dmParser, "_deprecationWarning");

      var arrayBuffer = Cesium3DTilesTester.generateInstancedTileBuffer({
        featureTableBinary: new Uint8Array(1),
      });
      I3dmParser.parse(arrayBuffer);

      expect(I3dmParser._deprecationWarning).toHaveBeenCalled();
    });

    it("parses i3dm", function () {
      var instancesLength = 10;

      var positions = new Float32Array(instancesLength * 3);
      var heights = new Float32Array(instancesLength);
      for (var i = 0; i < instancesLength; ++i) {
        positions[i * 3] = i;
        positions[i * 3 + 1] = i;
        positions[i * 3 + 2] = i;
        heights[i] = i;
      }

      var featureTableJson = {
        INSTANCES_LENGTH: instancesLength,
        POSITION: {
          byteOffset: 0,
        },
      };

      var featureTableBinary = positions;

      var batchTableJson = {
        height: {
          byteOffset: 0,
          componentType: "FLOAT",
          type: "SCALAR",
        },
      };

      var batchTableBinary = heights;

      var gltfUri = "model.gltf";

      var arrayBuffer = Cesium3DTilesTester.generateInstancedTileBuffer({
        featureTableJson: featureTableJson,
        featureTableBinary: featureTableBinary,
        batchTableJson: batchTableJson,
        batchTableBinary: batchTableBinary,
        gltfUri: gltfUri,
      });

      var results = I3dmParser.parse(arrayBuffer);

      expect(results.gltfFormat).toBe(1);
      expect(results.featureTableJson).toEqual(featureTableJson);
      expect(results.featureTableBinary).toEqual(featureTableBinary);
      expect(results.batchTableJson).toEqual(batchTableJson);
      expect(results.batchTableBinary).toEqual(batchTableBinary);
      expect(getStringFromTypedArray(results.gltf)).toEqual(gltfUri);
    });
  },
  "WebGL"
);
