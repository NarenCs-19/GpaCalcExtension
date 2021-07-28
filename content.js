console.log("content script running");
var grade_to_gpa = {
    'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'RA': 0, 'SA': 0
}

var subjectCredits = {};

chrome.runtime.onMessage.addListener(async (request) => {
    if (request.text === "showResult") {
        var tbody = document.querySelector("#subjects");//subjects table content
        var tbRows = document.querySelectorAll("#subjects tr");//table body rows
        var num = 0, creditsTotal = 0, flag = 1;


        var ses = $('#sessions').val();
        await $.ajax({
            url: "https://acoe.annauniv.edu/rusa/student/get_subjects",
            type: "post",
            data: { type: 5, flag: 'T', session: ses },
            dataType: 'html',
            success: function (request) {
                var i;
                for (i = 0; i < $(request).length - 1; i++) {
                    let subCode = $(request)[i].childNodes[1].innerText;
                    let credits = $(request)[i].childNodes[8].innerText;
                    subjectCredits[subCode] = credits;
                }
                console.log("hello");
            }
        });

        for (let i = 0; i < tbRows.length; i++) {
            let subCode = tbRows[i].childNodes[1].textContent;//Subject Code
            let grade = tbRows[i].childNodes[11].textContent;//grades
            if (grade in grade_to_gpa) {
                num += Number(subjectCredits[subCode]) * grade_to_gpa[grade];//numerator sum
                creditsTotal += Number(subjectCredits[subCode]);//denominator sum
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
            for (let i = 0; i < 12; i++) {
                var tableData = document.createElement('td');
                if (i == 10) {
                    var text = document.createTextNode("GPA");
                    tableData.appendChild(text);
                }
                else if (i == 11) {
                    var result = document.createTextNode(gpa);
                    tableData.appendChild(result);
                }
                gpaRow.appendChild(tableData);
            }
            tbody.appendChild(gpaRow);
            //sending message to popup.js to notify it that the result has shown and to background script to notify the GPA
            chrome.runtime.sendMessage({ text: "NotifyGpa", GPA: gpa, result: "shown" });
        }
        else {
            console.log("error");
            //send message to background if one of the subject's result was not announced or withheld
            chrome.runtime.sendMessage({ text: "NotifyError" });//sending message to background script to show notification
        }
    }
});