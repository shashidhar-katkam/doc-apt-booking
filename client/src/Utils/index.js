export const trimObj = (obj) => {
    if (obj != null && !Array.isArray(obj) && typeof obj != 'object') return obj;
    return Object.keys(obj).reduce(function (acc, key) {
        acc[key.trim()] = typeof obj[key] == 'string' ? obj[key].trim() : (obj[key] == null || obj[key] == undefined) ? obj[key] : trimObj(obj[key]);
        return acc;
    }, Array.isArray(obj) ? [] : {});
}




export const getTimeSlotByKey = (key) => {

    switch (key) {
        case 1000:
            return '10:00 AM'
        case 1030:
            return '10:30 AM'
        case 1100:
            return '11:00 AM'
        case 1130:
            return '11:30 AM'
        case 1200:
            return '12:00 PM'
        case 1230:
            return '12:30 PM'
        case 1400:
            return '02:00 PM'
        case 1430:
            return '02:30 PM'
        case 1500:
            return '03:00 PM'
        case 1530:
            return '03:30 PM'
        case 1600:
            return '04:00 PM'
        case 1630:
            return '04:30 PM'
        case 1800:
            return '06:00 PM'
        case 1830:
            return '06:30 PM'
        case 1900:
            return '07:00 PM'
        case 1930:
            return '07:30 PM'

    }

}
