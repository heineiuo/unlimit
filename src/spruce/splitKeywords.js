
const splitKeywords = (keywords) => keywords.split(
  new RegExp(/\-\|\,\|\.\|\?\|\:\|\;\|\'\|\"\|\!|'|\s|\+|,|\/|\u3002|\uff1b|\uff0c|\uff1a|\u201c|\u201d|\uff08|\uff09|\u3001|\uff1f|\u300a|\u300b/)
);

export default module.exports = splitKeywords;
