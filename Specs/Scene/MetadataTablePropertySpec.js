import {
  defaultValue,
  Cartesian3,
  MetadataClassProperty,
  MetadataTableProperty,
} from "../../Source/Cesium.js";
import MetadataTester from "../MetadataTester.js";

describe("Scene/MetadataTableProperty", function () {
  if (!MetadataTester.isSupported()) {
    return;
  }

  var enums = {
    myEnum: {
      values: [
        {
          value: 0,
          name: "ValueA",
        },
        {
          value: 1,
          name: "ValueB",
        },
        {
          value: 999,
          name: "Other",
        },
      ],
    },
  };

  it("creates metadata table property", function () {
    var extras = {
      other: 0,
    };

    var extensions = {
      EXT_other_extension: {},
    };

    var property = new MetadataTableProperty({
      count: 2,
      property: {
        bufferView: 0,
        extras: extras,
        extensions: extensions,
      },
      classProperty: new MetadataClassProperty({
        id: "property",
        property: {
          type: "FLOAT32",
        },
      }),
      bufferViews: {
        0: new Uint8Array(8),
      },
    });

    expect(property.extras).toBe(extras);
    expect(property.extensions).toBe(extensions);
  });

  it("constructor throws without count", function () {
    expect(function () {
      return new MetadataTableProperty({
        property: {},
        classProperty: {},
        bufferViews: {},
      });
    }).toThrowDeveloperError();
  });

  it("constructor throws if count is less than 1", function () {
    expect(function () {
      return new MetadataTableProperty({
        count: 0,
        property: {},
        classProperty: {},
        bufferViews: {},
      });
    }).toThrowDeveloperError();
  });

  it("constructor throws without property", function () {
    expect(function () {
      return new MetadataTableProperty({
        count: 1,
        classProperty: {},
        bufferViews: {},
      });
    }).toThrowDeveloperError();
  });

  it("constructor throws without bufferViews", function () {
    expect(function () {
      return new MetadataTableProperty({
        count: 1,
        property: {},
        classProperty: {},
      });
    }).toThrowDeveloperError();
  });

  function testGetUint64(options) {
    options = defaultValue(options, defaultValue.EMPTY_OBJECT);
    var disableBigIntSupport = options.disableBigIntSupport;
    var disableBigUint64ArraySupport = options.disableBigUint64ArraySupport;

    var originalValues = [
      BigInt(0), // eslint-disable-line
      BigInt(10), // eslint-disable-line
      BigInt("4611686018427387833"), // eslint-disable-line
      BigInt("18446744073709551615"), // eslint-disable-line
    ];

    var expectedValues = originalValues;

    if (disableBigUint64ArraySupport && disableBigIntSupport) {
      // Precision loss is expected if UINT64 is converted to JS numbers
      expectedValues = [0, 10, 4611686018427388000, 18446744073709552000];
    }

    var classProperty = {
      type: "UINT64",
    };

    var property = MetadataTester.createProperty({
      property: classProperty,
      values: originalValues,
      disableBigUint64ArraySupport: disableBigUint64ArraySupport,
      disableBigIntSupport: disableBigIntSupport,
    });

    var length = originalValues.length;
    for (var i = 0; i < length; ++i) {
      var value = property.get(i);
      expect(value).toEqual(expectedValues[i]);
    }
  }

  function testGetInt64(options) {
    options = defaultValue(options, defaultValue.EMPTY_OBJECT);
    var disableBigIntSupport = options.disableBigIntSupport;
    var disableBigInt64ArraySupport = options.disableBigInt64ArraySupport;

    var originalValues = [
      BigInt("-9223372036854775808"), // eslint-disable-line
      BigInt("-4611686018427387833"), // eslint-disable-line
      BigInt(-10), // eslint-disable-line
      BigInt(0), // eslint-disable-line
      BigInt(10), // eslint-disable-line
      BigInt("4611686018427387833"), // eslint-disable-line
      BigInt("9223372036854775807"), // eslint-disable-line
    ];

    var expectedValues = originalValues;

    if (disableBigInt64ArraySupport && disableBigIntSupport) {
      // Precision loss is expected if INT64 is converted to JS numbers
      expectedValues = [
        -9223372036854776000,
        -4611686018427388000,
        -10,
        0,
        10,
        4611686018427388000,
        9223372036854776000,
      ];
    }

    var classProperty = {
      type: "INT64",
    };

    var property = MetadataTester.createProperty({
      property: classProperty,
      values: originalValues,
      disableBigInt64ArraySupport: disableBigInt64ArraySupport,
      disableBigIntSupport: disableBigIntSupport,
    });

    var length = originalValues.length;
    for (var i = 0; i < length; ++i) {
      var value = property.get(i);
      expect(value).toEqual(expectedValues[i]);
    }
  }

  it("get returns UINT64 property as BigInt when BigUint64Array is not supported and BigInt is supported", function () {
    testGetUint64({
      disableBigUint64ArraySupport: true,
    });
  });

  it("get returns UINT64 property as number when BigUint64Array is not supported and BigInt is not supported", function () {
    testGetUint64({
      disableBigUint64ArraySupport: true,
      disableBigIntSupport: true,
    });
  });

  it("get returns INT64 property as BigInt when BigInt64Array is supported and BigInt is supported", function () {
    testGetInt64();
  });

  it("get returns INT64 property as BigInt when BigInt64Array is not supported and BigInt is supported", function () {
    testGetInt64({
      disableBigInt64ArraySupport: true,
    });
  });

  it("get returns INT64 property as number when BigInt64Array is not supported and BigInt is not supported", function () {
    testGetInt64({
      disableBigInt64ArraySupport: true,
      disableBigIntSupport: true,
    });
  });

  it("get returns single values", function () {
    // INT64 and UINT64 are tested above
    var properties = {
      propertyInt8: {
        type: "INT8",
      },
      propertyUint8: {
        type: "UINT8",
      },
      propertyInt16: {
        type: "INT16",
      },
      propertyUint16: {
        type: "UINT16",
      },
      propertyInt32: {
        type: "INT32",
      },
      propertyUint32: {
        type: "UINT32",
      },
      propertyFloat32: {
        type: "FLOAT32",
      },
      propertyFloat64: {
        type: "FLOAT64",
      },
      propertyBoolean: {
        type: "BOOLEAN",
      },
      propertyString: {
        type: "STRING",
      },
      propertyEnum: {
        type: "ENUM",
        enumType: "myEnum",
      },
    };

    var propertyValues = {
      propertyInt8: [-128, -10, 0, 10, 127],
      propertyUint8: [0, 10, 20, 30, 255],
      propertyInt16: [-32768, -10, 0, 10, 32767],
      propertyUint16: [0, 10, 20, 30, 65535],
      propertyInt32: [-2147483648, -10, 0, 10, 2147483647],
      propertyUint32: [0, 10, 20, 30, 4294967295],
      propertyFloat32: [-2.5, -1.0, 0.0, 700.0, Number.POSITIVE_INFINITY],
      propertyFloat64: [-234934.12, -1.0, 0.0, 700.0, Number.POSITIVE_INFINITY],
      propertyBoolean: [false, true, false, true, false],
      propertyString: ["おはようございます。😃", "a", "", "def", "0001"],
      propertyEnum: ["ValueA", "ValueB", "Other", "ValueA", "ValueA"],
    };

    for (var propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        var property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });

        var expectedValues = propertyValues[propertyId];
        var length = expectedValues.length;
        for (var i = 0; i < length; ++i) {
          var value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("get returns fixed size arrays", function () {
    var properties = {
      propertyInt8: {
        type: "ARRAY",
        componentType: "INT8",
        componentCount: 3,
      },
      propertyUint8: {
        type: "ARRAY",
        componentType: "UINT8",
        componentCount: 3,
      },
      propertyInt16: {
        type: "ARRAY",
        componentType: "INT16",
        componentCount: 3,
      },
      propertyUint16: {
        type: "ARRAY",
        componentType: "UINT16",
        componentCount: 3,
      },
      propertyInt32: {
        type: "ARRAY",
        componentType: "INT32",
        componentCount: 3,
      },
      propertyUint32: {
        type: "ARRAY",
        componentType: "UINT32",
        componentCount: 3,
      },
      propertyInt64: {
        type: "ARRAY",
        componentType: "INT64",
        componentCount: 3,
      },
      propertyUint64: {
        type: "ARRAY",
        componentType: "UINT64",
        componentCount: 3,
      },
      propertyFloat32: {
        type: "ARRAY",
        componentType: "FLOAT32",
        componentCount: 3,
      },
      propertyFloat64: {
        type: "ARRAY",
        componentType: "FLOAT64",
        componentCount: 3,
      },
      propertyBoolean: {
        type: "ARRAY",
        componentType: "BOOLEAN",
        componentCount: 3,
      },
      propertyString: {
        type: "ARRAY",
        componentType: "STRING",
        componentCount: 3,
      },
      propertyEnum: {
        type: "ARRAY",
        componentType: "ENUM",
        enumType: "myEnum",
        componentCount: 3,
      },
    };

    var propertyValues = {
      propertyInt8: [
        [-2, -1, 0],
        [1, 2, 3],
      ],
      propertyUint8: [
        [0, 1, 2],
        [3, 4, 5],
      ],
      propertyInt16: [
        [-2, -1, 0],
        [1, 2, 3],
      ],
      propertyUint16: [
        [0, 1, 2],
        [3, 4, 5],
      ],
      propertyInt32: [
        [-2, -1, 0],
        [1, 2, 3],
      ],
      propertyUint32: [
        [0, 1, 2],
        [3, 4, 5],
      ],
      propertyInt64: [
        [BigInt(-2), BigInt(-1), BigInt(0)], // eslint-disable-line
        [BigInt(1), BigInt(2), BigInt(3)], // eslint-disable-line
      ],
      propertyUint64: [
        [BigInt(0), BigInt(1), BigInt(2)], // eslint-disable-line
        [BigInt(3), BigInt(4), BigInt(5)], // eslint-disable-line
      ],
      propertyFloat32: [
        [-2.0, -1.0, 0.0],
        [1.0, 2.0, 3.0],
      ],
      propertyFloat64: [
        [-2.0, -1.0, 0.0],
        [1.0, 2.0, 3.0],
      ],
      propertyBoolean: [
        [false, true, false],
        [true, false, true],
      ],
      propertyString: [
        ["a", "bc", "def"],
        ["dog", "cat", "😃😃😃"],
      ],
      propertyEnum: [
        ["ValueA", "ValueB", "Other"],
        ["ValueA", "ValueA", "ValueA"],
      ],
    };

    for (var propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        var property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });

        var expectedValues = propertyValues[propertyId];
        var length = expectedValues.length;
        for (var i = 0; i < length; ++i) {
          var value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("get returns variable size arrays", function () {
    var properties = {
      propertyInt8: {
        type: "ARRAY",
        componentType: "INT8",
      },
      propertyUint8: {
        type: "ARRAY",
        componentType: "UINT8",
      },
      propertyInt16: {
        type: "ARRAY",
        componentType: "INT16",
      },
      propertyUint16: {
        type: "ARRAY",
        componentType: "UINT16",
      },
      propertyInt32: {
        type: "ARRAY",
        componentType: "INT32",
      },
      propertyUint32: {
        type: "ARRAY",
        componentType: "UINT32",
      },
      propertyInt64: {
        type: "ARRAY",
        componentType: "INT64",
      },
      propertyUint64: {
        type: "ARRAY",
        componentType: "UINT64",
      },
      propertyFloat32: {
        type: "ARRAY",
        componentType: "FLOAT32",
      },
      propertyFloat64: {
        type: "ARRAY",
        componentType: "FLOAT64",
      },
      propertyBoolean: {
        type: "ARRAY",
        componentType: "BOOLEAN",
      },
      propertyString: {
        type: "ARRAY",
        componentType: "STRING",
      },
      propertyEnum: {
        type: "ARRAY",
        componentType: "ENUM",
        enumType: "myEnum",
      },
    };

    // Tests empty arrays as well
    var propertyValues = {
      propertyInt8: [[-2], [-1, 0], [1, 2, 3], []],
      propertyUint8: [[0], [1, 2], [3, 4, 5], []],
      propertyInt16: [[-2], [-1, 0], [1, 2, 3], []],
      propertyUint16: [[0], [1, 2], [3, 4, 5], []],
      propertyInt32: [[-2], [-1, 0], [1, 2, 3], []],
      propertyUint32: [[0], [1, 2], [3, 4, 5], []],
      propertyInt64: [
        [BigInt(-2)], // eslint-disable-line
        [BigInt(-1), BigInt(0)], // eslint-disable-line
        [BigInt(1), BigInt(2), BigInt(3)], // eslint-disable-line
        [],
      ],
      propertyUint64: [
        [BigInt(0)], // eslint-disable-line
        [BigInt(1), BigInt(2)], // eslint-disable-line
        [BigInt(3), BigInt(4), BigInt(5)], // eslint-disable-line
        [],
      ],
      propertyFloat32: [[-2.0], [-1.0, 0.0], [1.0, 2.0, 3.0], []],
      propertyFloat64: [[-2.0], [-1.0, 0.0], [1.0, 2.0, 3.0], []],
      propertyBoolean: [[false], [true, false], [true, false, true], []],
      propertyString: [["a"], ["bc", "def"], ["dog", "cat", "😃😃😃"], []],
      propertyEnum: [
        ["ValueA"],
        ["ValueB", "Other"],
        ["ValueA", "ValueA", "ValueA"],
        [],
      ],
    };

    for (var propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        var property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });

        var expectedValues = propertyValues[propertyId];
        var length = expectedValues.length;
        for (var i = 0; i < length; ++i) {
          var value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("get returns normalized value", function () {
    var propertyInt8 = MetadataTester.createProperty({
      property: {
        type: "INT8",
        normalized: true,
      },
      values: [-128],
    });

    var propertyUint8 = MetadataTester.createProperty({
      property: {
        type: "UINT8",
        normalized: true,
      },
      values: [255],
    });

    expect(propertyInt8.get(0)).toBe(-1.0);
    expect(propertyUint8.get(0)).toBe(1.0);
  });

  it("get throws without index", function () {
    var property = MetadataTester.createProperty({
      property: {
        type: "FLOAT32",
      },
      values: [1.0, 2.0],
    });

    expect(function () {
      property.get();
    }).toThrowDeveloperError();
  });

  it("get throws if index is out of bounds", function () {
    var property = MetadataTester.createProperty({
      property: {
        type: "FLOAT32",
      },
      values: [1.0, 2.0],
    });

    expect(property.get(0)).toBe(1.0);
    expect(property.get(1)).toBe(2.0);

    expect(function () {
      property.get(2);
    }).toThrowDeveloperError();
  });

  it("set sets single values", function () {
    var properties = {
      propertyInt8: {
        type: "INT8",
      },
      propertyUint8: {
        type: "UINT8",
      },
      propertyInt16: {
        type: "INT16",
      },
      propertyUint16: {
        type: "UINT16",
      },
      propertyInt32: {
        type: "INT32",
      },
      propertyUint32: {
        type: "UINT32",
      },
      propertyInt64: {
        type: "INT64",
      },
      propertyUint64: {
        type: "UINT64",
      },
      propertyFloat32: {
        type: "FLOAT32",
      },
      propertyFloat64: {
        type: "FLOAT64",
      },
      propertyBoolean: {
        type: "BOOLEAN",
      },
      propertyString: {
        type: "STRING",
      },
      propertyEnum: {
        type: "ENUM",
        enumType: "myEnum",
      },
    };

    var propertyValues = {
      propertyInt8: [0, 0, 0, 0, 0],
      propertyUint8: [0, 0, 0, 0, 0],
      propertyInt16: [0, 0, 0, 0, 0],
      propertyUint16: [0, 0, 0, 0, 0],
      propertyInt32: [0, 0, 0, 0, 0],
      propertyUint32: [0, 0, 0, 0, 0],
      propertyInt64: [BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
      propertyUint64: [BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
      propertyFloat32: [0.0, 0.0, 0.0, 0.0, 0.0],
      propertyFloat64: [0.0, 0.0, 0.0, 0.0, 0.0],
      propertyBoolean: [false, false, true, false, true],
      propertyString: ["", "", "", "", ""],
      propertyEnum: ["Other", "Other", "Other", "Other", "Other"],
    };

    var valuesToSet = {
      propertyInt8: [-128, -10, 0, 10, 127],
      propertyUint8: [0, 10, 20, 30, 255],
      propertyInt16: [-32768, -10, 0, 10, 32767],
      propertyUint16: [0, 10, 20, 30, 65535],
      propertyInt32: [-2147483648, -10, 0, 10, 2147483647],
      propertyUint32: [0, 10, 20, 30, 4294967295],
      propertyInt64: [
        BigInt("-9223372036854775808"), // eslint-disable-line
        BigInt("-4611686018427387833"), // eslint-disable-line
        BigInt(0), // eslint-disable-line
        BigInt("4611686018427387833"), // eslint-disable-line
        BigInt("9223372036854775807"), // eslint-disable-line
      ],
      propertyUint64: [
        BigInt(0), // eslint-disable-line
        BigInt(10), // eslint-disable-line
        BigInt(100), // eslint-disable-line
        BigInt("4611686018427387833"), // eslint-disable-line
        BigInt("18446744073709551615"), // eslint-disable-line
      ],
      propertyFloat32: [-2.5, -1.0, 0.0, 700.0, Number.POSITIVE_INFINITY],
      propertyFloat64: [-234934.12, -1.0, 0.0, 700.0, Number.POSITIVE_INFINITY],
      propertyBoolean: [true, true, false, false, true],
      propertyString: ["おはようございます。😃", "a", "", "def", "0001"],
      propertyEnum: ["ValueA", "ValueB", "Other", "ValueA", "ValueA"],
    };

    for (var propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        var property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });

        var expectedValues = valuesToSet[propertyId];
        var length = expectedValues.length;
        for (var i = 0; i < length; ++i) {
          property.set(i, expectedValues[i]);
          var value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
          // Test setting / getting again
          property.set(i, expectedValues[i]);
          value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("set sets fixed size arrays", function () {
    var properties = {
      propertyInt8: {
        type: "ARRAY",
        componentType: "INT8",
        componentCount: 3,
      },
      propertyUint8: {
        type: "ARRAY",
        componentType: "UINT8",
        componentCount: 3,
      },
      propertyInt16: {
        type: "ARRAY",
        componentType: "INT16",
        componentCount: 3,
      },
      propertyUint16: {
        type: "ARRAY",
        componentType: "UINT16",
        componentCount: 3,
      },
      propertyInt32: {
        type: "ARRAY",
        componentType: "INT32",
        componentCount: 3,
      },
      propertyUint32: {
        type: "ARRAY",
        componentType: "UINT32",
        componentCount: 3,
      },
      propertyInt64: {
        type: "ARRAY",
        componentType: "INT64",
        componentCount: 3,
      },
      propertyUint64: {
        type: "ARRAY",
        componentType: "UINT64",
        componentCount: 3,
      },
      propertyFloat32: {
        type: "ARRAY",
        componentType: "FLOAT32",
        componentCount: 3,
      },
      propertyFloat64: {
        type: "ARRAY",
        componentType: "FLOAT64",
        componentCount: 3,
      },
      propertyBoolean: {
        type: "ARRAY",
        componentType: "BOOLEAN",
        componentCount: 3,
      },
      propertyString: {
        type: "ARRAY",
        componentType: "STRING",
        componentCount: 3,
      },
      propertyEnum: {
        type: "ARRAY",
        componentType: "ENUM",
        enumType: "myEnum",
        componentCount: 3,
      },
    };

    var propertyValues = {
      propertyInt8: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      propertyUint8: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      propertyInt16: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      propertyUint16: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      propertyInt32: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      propertyUint32: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      propertyInt64: [
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
      ],
      propertyUint64: [
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
      ],
      propertyFloat32: [
        [0.0, 0.0, 0.0],
        [0.0, 0.0, 0.0],
      ],
      propertyFloat64: [
        [0.0, 0.0, 0.0],
        [0.0, 0.0, 0.0],
      ],
      propertyBoolean: [
        [false, false, false],
        [true, true, true],
      ],
      propertyString: [
        ["", "", ""],
        ["", "", ""],
      ],
      propertyEnum: [
        ["Other", "Other", "Other"],
        ["Other", "Other", "Other"],
      ],
    };

    var valuesToSet = {
      propertyInt8: [new Cartesian3(-2, -1, 0), new Cartesian3(1, 2, 3)],
      propertyUint8: [new Cartesian3(0, 1, 2), new Cartesian3(3, 4, 5)],
      propertyInt16: [new Cartesian3(-2, -1, 0), new Cartesian3(1, 2, 3)],
      propertyUint16: [new Cartesian3(0, 1, 2), new Cartesian3(3, 4, 5)],
      propertyInt32: [new Cartesian3(-2, -1, 0), new Cartesian3(1, 2, 3)],
      propertyUint32: [new Cartesian3(0, 1, 2), new Cartesian3(3, 4, 5)],
      propertyInt64: [
        [BigInt(-2), BigInt(-1), BigInt(0)], // eslint-disable-line
        [BigInt(1), BigInt(2), BigInt(3)], // eslint-disable-line
      ],
      propertyUint64: [
        [BigInt(0), BigInt(1), BigInt(2)], // eslint-disable-line
        [BigInt(3), BigInt(4), BigInt(5)], // eslint-disable-line
      ],
      propertyFloat32: [
        new Cartesian3(-2.0, -1.0, 0.0),
        new Cartesian3(1.0, 2.0, 3.0),
      ],
      propertyFloat64: [
        new Cartesian3(-2.0, -1.0, 0.0),
        new Cartesian3(1.0, 2.0, 3.0),
      ],
      propertyBoolean: [
        [false, true, false],
        [true, false, true],
      ],
      propertyString: [
        ["a", "bc", "def"],
        ["dog", "cat", "😃😃😃"],
      ],
      propertyEnum: [
        ["ValueA", "ValueB", "Other"],
        ["ValueA", "ValueA", "ValueA"],
      ],
    };

    for (var propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        var property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });
        var expectedValues = valuesToSet[propertyId];
        var length = expectedValues.length;
        for (var i = 0; i < length; ++i) {
          property.set(i, expectedValues[i]);
          var value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
          // Test setting / getting again
          property.set(i, expectedValues[i]);
          value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("set sets variable size arrays with arrays of the same length", function () {
    var properties = {
      propertyInt8: {
        type: "ARRAY",
        componentType: "INT8",
      },
      propertyUint8: {
        type: "ARRAY",
        componentType: "UINT8",
      },
      propertyInt16: {
        type: "ARRAY",
        componentType: "INT16",
      },
      propertyUint16: {
        type: "ARRAY",
        componentType: "UINT16",
      },
      propertyInt32: {
        type: "ARRAY",
        componentType: "INT32",
      },
      propertyUint32: {
        type: "ARRAY",
        componentType: "UINT32",
      },
      propertyInt64: {
        type: "ARRAY",
        componentType: "INT64",
      },
      propertyUint64: {
        type: "ARRAY",
        componentType: "UINT64",
      },
      propertyFloat32: {
        type: "ARRAY",
        componentType: "FLOAT32",
      },
      propertyFloat64: {
        type: "ARRAY",
        componentType: "FLOAT64",
      },
      propertyBoolean: {
        type: "ARRAY",
        componentType: "BOOLEAN",
      },
      propertyString: {
        type: "ARRAY",
        componentType: "STRING",
      },
      propertyEnum: {
        type: "ARRAY",
        componentType: "ENUM",
        enumType: "myEnum",
      },
    };

    var propertyValues = {
      propertyInt8: [[0], [0, 0], [0, 0, 0], []],
      propertyUint8: [[0], [0, 0], [0, 0, 0], []],
      propertyInt16: [[0], [0, 0], [0, 0, 0], []],
      propertyUint16: [[0], [0, 0], [0, 0, 0], []],
      propertyInt32: [[0], [0, 0], [0, 0, 0], []],
      propertyUint32: [[0], [0, 0], [0, 0, 0], []],
      propertyInt64: [
        [BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
        [],
      ],
      propertyUint64: [
        [BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
        [],
      ],
      propertyFloat32: [[0.0], [0.0, 0.0], [0.0, 0.0, 0.0], []],
      propertyFloat64: [[0.0], [0.0, 0.0], [0.0, 0.0, 0.0], []],
      propertyBoolean: [[false], [false, false], [false, false, false], []],
      propertyString: [[""], ["", ""], ["", "", ""], []],
      propertyEnum: [
        ["Other"],
        ["Other", "Other"],
        ["Other", "Other", "Other"],
        [],
      ],
    };

    var valuesToSet = {
      propertyInt8: [[-2], [-1, 0], [1, 2, 3], []],
      propertyUint8: [[0], [1, 2], [3, 4, 5], []],
      propertyInt16: [[-2], [-1, 0], [1, 2, 3], []],
      propertyUint16: [[0], [1, 2], [3, 4, 5], []],
      propertyInt32: [[-2], [-1, 0], [1, 2, 3], []],
      propertyUint32: [[0], [1, 2], [3, 4, 5], []],
      propertyInt64: [
        [BigInt(-2)], // eslint-disable-line
        [BigInt(-1), BigInt(0)], // eslint-disable-line
        [BigInt(1), BigInt(2), BigInt(3)], // eslint-disable-line
        [],
      ],
      propertyUint64: [
        [BigInt(0)], // eslint-disable-line
        [BigInt(1), BigInt(2)], // eslint-disable-line
        [BigInt(3), BigInt(4), BigInt(5)], // eslint-disable-line
        [],
      ],
      propertyFloat32: [[-2.0], [-1.0, 0.0], [1.0, 2.0, 3.0], []],
      propertyFloat64: [[-2.0], [-1.0, 0.0], [1.0, 2.0, 3.0], []],
      propertyBoolean: [[false], [true, false], [true, false, true], []],
      propertyString: [["a"], ["bc", "def"], ["dog", "cat", "😃😃😃"], []],
      propertyEnum: [
        ["ValueA"],
        ["ValueB", "Other"],
        ["ValueA", "ValueA", "ValueA"],
        [],
      ],
    };

    for (var propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        var property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });
        var expectedValues = valuesToSet[propertyId];
        var length = expectedValues.length;
        for (var i = 0; i < length; ++i) {
          property.set(i, expectedValues[i]);
          var value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
          // Test setting / getting again
          property.set(i, expectedValues[i]);
          value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("set sets variable size arrays with arrays of different lengths", function () {
    var properties = {
      propertyInt8: {
        type: "ARRAY",
        componentType: "INT8",
      },
      propertyUint8: {
        type: "ARRAY",
        componentType: "UINT8",
      },
      propertyInt16: {
        type: "ARRAY",
        componentType: "INT16",
      },
      propertyUint16: {
        type: "ARRAY",
        componentType: "UINT16",
      },
      propertyInt32: {
        type: "ARRAY",
        componentType: "INT32",
      },
      propertyUint32: {
        type: "ARRAY",
        componentType: "UINT32",
      },
      propertyInt64: {
        type: "ARRAY",
        componentType: "INT64",
      },
      propertyUint64: {
        type: "ARRAY",
        componentType: "UINT64",
      },
      propertyFloat32: {
        type: "ARRAY",
        componentType: "FLOAT32",
      },
      propertyFloat64: {
        type: "ARRAY",
        componentType: "FLOAT64",
      },
      propertyBoolean: {
        type: "ARRAY",
        componentType: "BOOLEAN",
      },
      propertyString: {
        type: "ARRAY",
        componentType: "STRING",
      },
      propertyEnum: {
        type: "ARRAY",
        componentType: "ENUM",
        enumType: "myEnum",
      },
    };

    var propertyValues = {
      propertyInt8: [[0], [0, 0], [0, 0, 0], []],
      propertyUint8: [[0], [0, 0], [0, 0, 0], []],
      propertyInt16: [[0], [0, 0], [0, 0, 0], []],
      propertyUint16: [[0], [0, 0], [0, 0, 0], []],
      propertyInt32: [[0], [0, 0], [0, 0, 0], []],
      propertyUint32: [[0], [0, 0], [0, 0, 0], []],
      propertyInt64: [
        [BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
        [],
      ],
      propertyUint64: [
        [BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
        [],
      ],
      propertyFloat32: [[0.0], [0.0, 0.0], [0.0, 0.0, 0.0], []],
      propertyFloat64: [[0.0], [0.0, 0.0], [0.0, 0.0, 0.0], []],
      propertyBoolean: [[false], [false, false], [false, false, false], []],
      propertyString: [[""], ["", ""], ["", "", ""], []],
      propertyEnum: [
        ["Other"],
        ["Other", "Other"],
        ["Other", "Other", "Other"],
        [],
      ],
    };

    var valuesToSet = {
      propertyInt8: [[1, 2, 3], [], [-2], [-1, 0]],
      propertyUint8: [[3, 4, 5], [0], [], [1, 2]],
      propertyInt16: [[], [1, 2, 3], [-2], [-1, 0]],
      propertyUint16: [[3, 4, 5], [1, 2], [], [0]],
      propertyInt32: [[1, 2, 3], [], [-2], [-1, 0]],
      propertyUint32: [[0], [3, 4, 5], [1, 2], []],
      propertyInt64: [
        [BigInt(-1), BigInt(0)], // eslint-disable-line
        [BigInt(-2)], // eslint-disable-line
        [],
        [BigInt(1), BigInt(2), BigInt(3)], // eslint-disable-line
      ],
      propertyUint64: [
        [BigInt(0)], // eslint-disable-line
        [],
        [BigInt(1), BigInt(2)], // eslint-disable-line
        [BigInt(3), BigInt(4), BigInt(5)], // eslint-disable-line
      ],
      propertyFloat32: [[-1.0, 0.0], [1.0, 2.0, 3.0], [], [-2.0]],
      propertyFloat64: [[-2.0], [1.0, 2.0, 3.0], [-1.0, 0.0], []],
      propertyBoolean: [[true, false, true], [], [false], [true, false]],
      propertyString: [[], ["bc", "def"], ["a"], ["dog", "cat", "😃😃😃"]],
      propertyEnum: [
        [],
        ["ValueA", "ValueA", "ValueA"],
        ["ValueA"],
        ["ValueB", "Other"],
      ],
    };

    for (var propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        var property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });
        var expectedValues = valuesToSet[propertyId];
        var length = expectedValues.length;
        for (var i = 0; i < length; ++i) {
          property.set(i, expectedValues[i]);
          var value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
          // Test setting / getting again
          property.set(i, expectedValues[i]);
          value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("set sets Infinity for FLOAT32 and FLOAT64", function () {
    var propertyFloat32 = MetadataTester.createProperty({
      property: {
        type: "FLOAT32",
      },
      values: [0.0, 0.0],
    });

    var propertyFloat64 = MetadataTester.createProperty({
      property: {
        type: "FLOAT64",
      },
      values: [0.0, 0.0],
    });

    propertyFloat32.set(0, Number.POSITIVE_INFINITY);
    propertyFloat32.set(1, Number.NEGATIVE_INFINITY);
    propertyFloat64.set(0, Number.POSITIVE_INFINITY);
    propertyFloat64.set(1, Number.NEGATIVE_INFINITY);

    expect(propertyFloat32.get(0)).toBe(Number.POSITIVE_INFINITY);
    expect(propertyFloat32.get(1)).toBe(Number.NEGATIVE_INFINITY);
    expect(propertyFloat64.get(0)).toBe(Number.POSITIVE_INFINITY);
    expect(propertyFloat64.get(1)).toBe(Number.NEGATIVE_INFINITY);
  });

  it("set sets NaN for FLOAT32 and FLOAT64", function () {
    var propertyFloat32 = MetadataTester.createProperty({
      property: {
        type: "FLOAT32",
      },
      values: [0.0],
    });

    var propertyFloat64 = MetadataTester.createProperty({
      property: {
        type: "FLOAT64",
      },
      values: [0.0],
    });

    propertyFloat32.set(0, NaN);
    propertyFloat64.set(0, NaN);

    expect(isNaN(propertyFloat32.get(0))).toBe(true);
    expect(isNaN(propertyFloat64.get(0))).toBe(true);
  });

  it("set sets value for normalized property", function () {
    var propertyInt8 = MetadataTester.createProperty({
      property: {
        type: "INT8",
        normalized: true,
      },
      values: [0],
    });

    var propertyUint8 = MetadataTester.createProperty({
      property: {
        type: "UINT8",
        normalized: true,
      },
      values: [255],
    });

    propertyInt8.set(0, -1.0);
    propertyUint8.get(0, 1.0);

    expect(propertyInt8.get(0)).toBe(-1.0);
    expect(propertyUint8.get(0)).toBe(1.0);
  });

  it("set throws without index", function () {
    var property = MetadataTester.createProperty({
      property: {
        type: "FLOAT32",
      },
      values: [1.0, 2.0],
    });

    expect(function () {
      property.set();
    }).toThrowDeveloperError();
  });

  it("set throws if index is out of bounds", function () {
    var property = MetadataTester.createProperty({
      property: {
        type: "FLOAT32",
      },
      values: [1.0, 2.0],
    });

    expect(function () {
      property.set(-1, 0.0);
    }).toThrowDeveloperError();

    property.set(0, 0.0);
    property.set(1, 0.0);

    expect(function () {
      property.set(2, 0.0);
    }).toThrowDeveloperError();
  });

  it("set throws if value doesn't conform to the class property", function () {
    var property = MetadataTester.createProperty({
      property: {
        type: "ARRAY",
        componentType: "FLOAT32",
        componentCount: 3,
      },
      values: [[1.0, 2.0, 3.0]],
    });

    expect(function () {
      property.set(0, 8.0);
    }).toThrowDeveloperError();
  });
});
