let gpaCalc = document.getElementById("gpa-calc");
var isShown = false;
chrome.runtime.onMessage.addListener((request) => {
    if (request.result === "shown")
        isShown = true;
});

gpaCalc.addEventListener("click", () => {
    console.log("calc button clicked");
    if (!isShown) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { text: "showResult" });
        });
    }
});
