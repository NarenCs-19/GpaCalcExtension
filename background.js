chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message.text == "Notify"){
        var notifBody = {
            type : 'basic',
            iconUrl : "Images/icons8-calculator-48.png",
            title : "Error",
            message : "Grades are not being published for all subjects or being in withheld" 
        }
        chrome.notifications.create("",notifBody);
    }
});