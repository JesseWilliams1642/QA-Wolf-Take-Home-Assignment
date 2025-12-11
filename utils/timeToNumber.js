function convertTime(time) {
  const splitString = time.split(" ");
  switch (splitString[1]) {
    case "minute":
      return 1;
    case "minutes":
      return parseInt(splitString[0]);
    case "hour":
      return 60;
    case "hours":
      return parseInt(splitString[0]) * 60;
    case "day":
      return 60 * 24;
    case "days":
      return parseInt(splitString[0]) * 60 * 24;
    case "month":
      return 60 * 24 * 30;
    case "months":
      return parseInt(splitString[0]) * 60 * 24 * 30;
    case "year":
      return 60 * 24 * 30 * 12;
    case "years":
      return parseInt(splitString[0]) * 60 * 24 * 30 * 12;;
    default:
      throw new Error("Time could not be converted.");
  }
}

module.exports = { convertTime };