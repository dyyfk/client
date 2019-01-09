var moment = require('moment');
var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: "https://ditu.amap.com/regeo?lng="+longitude+"&lat="+latitude,
    createdAt: moment().valueOf()
  };
};

module.exports = {generateMessage, generateLocationMessage};
