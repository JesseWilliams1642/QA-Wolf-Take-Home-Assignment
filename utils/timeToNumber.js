function convertTime(time) {

    const matchesRegex = time.match(/[Jan,Feb,March,April,May,June,July,Aug,Sept,Oct,Nov,Dec]\s[1-3]{0,1}[0-9],\s[0-9][0-9][0-9][0-9]/i);
    if (matchesRegex) {
        const splitString = time.split(" ");
        const day = parseInt(splitString[2].slice(0, -1));
        const month = monthToNumber.get(splitString[1]);
        const year = parseInt(splitString[3]);

        const today = new Date();
        const date = new Date(year, month, day);

        return (today.getTime() - date.getTime()) / 60000; // Return time in minutes

    } else {

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
            default:
                throw new Error("Time could not be converted.");
        }

    }

}

module.exports = { convertTime };

const monthMappings = [
    ["Jan", 0],
    ["Feb", 1], 
    ["March", 2], 
    ["April", 3], 
    ["May", 4], 
    ["June", 5], 
    ["July", 6], 
    ["Aug", 7], 
    ["Sept", 8], 
    ["Oct", 9], 
    ["Nov", 10], 
    ["Dec", 11]
]
const monthToNumber = new Map(monthMappings);