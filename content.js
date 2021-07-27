console.log("content script running");
var grade_to_gpa = {
    'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'RA': 0, 'SA': 0
}

var subjectCredits = {
    "HS6151": 5, "PH6151": 5, "MA6151": 5, "CS6101": 6, "CS6102": 3,
    "HS6251": 5, "CY6251": 5, "MA6251": 5, "GE6251": 5, "CS6103": 4,
    "CS6104": 7, "CS6105": 7, "MA6351": 5, "EE6351": 7, "HS6393": 3
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "hello") {
        var tbody = document.querySelector("#subjects");//subjects table content
        var tbRows = document.querySelectorAll("#subjects tr");//table body rows
        var num = 0, creditsTotal = 0, flag = 1;

        for (let i = 0; i < tbRows.length; i++) {
            let subCode = tbRows[i].childNodes[1].textContent;//Subject Code
            let grade = tbRows[i].childNodes[11].textContent;//grades
            if (grade in grade_to_gpa) {
                num += subjectCredits[subCode] * grade_to_gpa[grade];//numerator sum
                creditsTotal += subjectCredits[subCode];//denominator sum
            }
            else {
                flag = 0;
                break;
            }
        }
        if (flag) {
            var gpa = num / creditsTotal;
            gpa = gpa.toString();
            gpa = gpa.slice(0, (gpa.indexOf(".")) + 3);
            Number(gpa);
            console.log(gpa);
            var gpaRow = document.createElement('tr');
            for (let i = 0; i < 11; i++) {
                var tableData = document.createElement('td');
                gpaRow.appendChild(tableData);
            }
            var tableData = document.createElement('td');
            var result = document.createTextNode(gpa);
            tableData.appendChild(result);
            gpaRow.appendChild(tableData);
            tbody.appendChild(gpaRow);
        }
        else{
            console.log("error");
            //send message to background if one of the subject's result was not announced or withheld
            chrome.runtime.sendMessage({text:"Notify"});
        }
    }
});