chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'acoe.annauniv.edu'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});

chrome.runtime.onMessage.addListener((message)=>{
  if (message.text === "NotifyError") {
    var notifBody = {
      type: 'basic',
      iconUrl: "Images/icons8-calculator-48.png",
      title: "Error",
      message: "Grades are not being published for all subjects or being in withheld"
    }
    chrome.notifications.create("", notifBody);
  }
  else if (message.text === "NotifyGpa") {

    var notifBody = {
      type: 'basic',
      iconUrl: "Images/icons8-calculator-48.png",
      title: "RESULT",
      message: "Your GPA is "+message.GPA
    }
    chrome.notifications.create("", notifBody);
  }
});