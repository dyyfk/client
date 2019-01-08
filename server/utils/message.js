var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt:new Date().getTime()
  };
};

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: "https://ditu.amap.com/regeo?lng="+longitude+"&lat="+latitude,
    createdAt: new Date().getTime()
  };
};

module.exports = {generateMessage, generateLocationMessage};
