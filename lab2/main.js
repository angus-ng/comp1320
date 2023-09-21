const labTwo = require("./lab-two");
const readline = require("readline-sync");

labTwo.makeCalendar(2023);
console.log(getDayOfTheWeekForUserDate());

function getDayOfTheWeekForUserDate() {
    const userYMD = [];

    userYMD[0] = parseInt(readline.question("Enter a Year: "));
    userYMD[1] = readline.question("Enter a Month: ");
    userYMD[2] = parseInt(readline.question("Enter a Day: "));

    console.log(`Your input: Year: ${userYMD[0]} Month: ${userYMD[1]} Day: ${userYMD[2]}`);

    const result = labTwo.getDayOfTheWeek(userYMD[0],userYMD[1],userYMD[2]);
    
    return result;
    
}
