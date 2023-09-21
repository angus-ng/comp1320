function getDayOfTheWeek(year, month, day) {
    const monthCodeArray = [1, 4, 4, 0, 2, 5, 0, 3, 6, 1, 4, 6]; //array for month codes used for calculation of day of the week
    const dayIdentifier = ["Saturday","Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthsThirty = [3, 5, 8, 10]; //index positions of months with 30 days
    const inputCheck = [true, true, true, true]; //array of input validity [year, month, day, leap year conditional]
    
    if (isNaN(parseInt(month)) && (typeof month == "string")) { //check month input to see if it is a string or number
        month = month.toLowerCase(); // formatting of string input for comparison
        month = month[0].toUpperCase() + month.slice(1);
    } else if (typeof parseInt(month) == "number") { // if it is a valid number for a month, -1 for array position
        if (month > 0 && month <= 12) {
            month = monthsArray[month-1];
        } else { 
            inputCheck[1] = false;
        }
    }

    const monthIndex = monthsArray.indexOf(month); //input month to array position
    if (monthIndex == -1) {
        inputCheck[1] = false;
    }
    let monthCode = monthCodeArray[monthIndex]; //corresponding month code for the day of the week calculation

    if (isNaN(parseInt(year))) { //checks year input for validity
        inputCheck[0] = false;
    } else if (typeof parseInt(year) == "number") {
        if (year < 1600){ 
            inputCheck[0] = false;
        }
    }

    if (isNaN(day)){  //checks day input for validity
        inputCheck[2] = false;
    } else if (typeof parseInt(day) == "number") {
        if (day < 0 || day > 31) { 
            inputCheck[2] = false;
        }
        if (monthsThirty.includes(monthIndex)) { 
            if (day > 30) {
                inputCheck[2] = false;
                console.log("Invalid date for specified month. Available date range is 1-30");
            }
        } else if (monthIndex == 1) {
            if (day > 28 && (isLeapYear(year) == false)) {
                    inputCheck[2] = false;
                    console.log("Invalid date for specified month. Available date range is 1-28");
                }
            }
        }
    
    //special case for leap years
    const leapYearCheck = isLeapYear(year);
    if (leapYearCheck == true) {
        if ((month == monthsArray[0]) || (month == monthsArray[1])) { 
            monthCode = monthCode - 1; //if it is a leap year -1 to month code value
        } 
        if ((month == monthsArray[1]) && (day > 29)) {
            inputCheck[3] = false;
        }

    }

    const yearFirst2 = parseInt((year.toString()).slice(0,2)); //first two digits of the year
    const yearLast2 = parseInt((year.toString()).slice(-2)); //last two digits of the year
    
    //special cases for 1600's, 1700's, 1800's, 2000's, 2100's
    if (yearFirst2 == 16) {
        monthCode = monthCode + 6;
    } else if (yearFirst2 == 17) {
        monthCode = monthCode + 4;
    } else if (yearFirst2 == 18) {
        monthCode = monthCode + 2;
    } else if (yearFirst2 == 20) {
        monthCode = monthCode + 6;
    } else if (yearFirst2 == 21) {
        monthCode = monthCode + 4;
    }

    const yearTwelves = ~~(yearLast2 / 12); //12's that fit into the last 2 digits of the year
    const yearTwelvesRemainder = yearLast2 % 12; //remainder of last 2 digits of year divided by 12
    const yearFours = ~~(yearTwelvesRemainder / 4); //4's that fit into the remainder of the twelves division 

    const whatDayIndex = ((yearTwelves + yearTwelvesRemainder + yearFours + day + monthCode) % 7); //day of the week calculation

    if (inputCheck.includes(false)) { //error responses for invalid inputs
        if (inputCheck[0] == false) {
            console.log(`Invalid year input. Please input a valid year in the format of a number and is or is after the year 1600 i.e. 2023`);
        } 
        if (inputCheck[1] == false) {
            console.log(`Invalid month input. Please input a valid month. i.e. 1-12 or spelled out i.e. January`);
        } 
        if (inputCheck[2] == false) {
            console.log(`Invalid day input. Please input a valid date i.e. 1-31 for the inputted month`);
        }
        if (inputCheck[3] == false) {
            console.log(`Invalid day input. The input year is a leap year and February has 29 days.`);
        }
        return "Input error, see console for more details.";
    } else {
        return dayIdentifier[whatDayIndex]; //return date as String from array
    }
}

function isLeapYear(year) { //function determines if inputted variable (year) is a leap year
    if(year % 4 == 0 || ((year % 100 == 0) && (year % 400 == 0))) { //(year is divisible by 4) or (year is divisible by 100 and is divisible by 400)
            return true;
        } else {
            return false;
        }
}

function makeCalendar(year) { //function that makes a calendar for the inputted variable (year)
    const daysArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //array of the days in each month

    if (isLeapYear(year) == true) { //leap year case, add a day to february
        daysArray[1] += 1; 
    }

    for (let m = 0; m < daysArray.length; m++) { //for the length of the array (12 months)
            monthFix = m + 1; //non-zero months
        for (let d = 0; d < daysArray[m]; d++) { //for the value in each index (days)
            dayFix = d + 1; //non-zero days
            console.log(`${monthFix}-${dayFix}-${year} is a ${getDayOfTheWeek(year, monthFix, dayFix)}.`);
        }
    }
}

module.exports = {getDayOfTheWeek, makeCalendar};