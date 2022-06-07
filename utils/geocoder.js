const nodeGeocoder = require("node-geocoder");

const options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: "wsW75C2R2FmksUsGc0Iizd2q3NDGDjQ5",
  formatter: null,
};

const geocoder = nodeGeocoder(options);
module.exports = geocoder;
