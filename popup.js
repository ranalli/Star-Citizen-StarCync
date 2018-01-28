function followORG() {
    chrome.tabs.query({ url: "https://robertsspaceindustries.com/*"}, function(tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
            //alert("Follow");
            var activeTab = tabs[0];
            chrome.tabs.executeScript(activeTab.id, { file: 'content_script.js' }, function () {
                chrome.tabs.sendMessage(activeTab.id, { "action": 1 });
            });
    });
}

function unfollowORG() {
    chrome.tabs.query({ url: "https://robertsspaceindustries.com/*" }, function (tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
       // alert("Unfollow");
        var activeTab = tabs[0];
        chrome.tabs.executeScript(activeTab.id, { file: 'content_script.js' }, function () {
            chrome.tabs.sendMessage(activeTab.id, { "action": 2 });
        });
    });
}

function backUP() {
    chrome.tabs.query({ url: "https://robertsspaceindustries.com/*" }, function (tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
        // alert("Unfollow");
        var activeTab = tabs[0];
        chrome.tabs.executeScript(activeTab.id, { file: 'content_script.js' }, function () {
            chrome.tabs.sendMessage(activeTab.id, { "action": 3 });
        });
    });
}

function loadbackUP() {
    chrome.tabs.query({ url: "https://robertsspaceindustries.com/*" }, function (tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
        // alert("Unfollow");
        var activeTab = tabs[0];
        chrome.tabs.executeScript(activeTab.id, { file: 'content_script.js' }, function () {
            chrome.tabs.sendMessage(activeTab.id, { "action": 4 });
        });
    });
}

function eraseALL() {
    chrome.tabs.query({ url: "https://robertsspaceindustries.com/*" }, function (tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
        // alert("Unfollow");
        var activeTab = tabs[0];
        chrome.tabs.executeScript(activeTab.id, { file: 'content_script.js' }, function () {
            chrome.tabs.sendMessage(activeTab.id, { "action": 5 });
        });
    });
}

function eraseBackup() {
    chrome.tabs.query({ url: "https://robertsspaceindustries.com/*" }, function (tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
        // alert("Unfollow");
        var activeTab = tabs[0];
        chrome.tabs.executeScript(activeTab.id, { file: 'content_script.js' }, function () {
            chrome.tabs.sendMessage(activeTab.id, { "action": 6 });
        });
    });
}
function addfromList() {
    chrome.tabs.query({ url: "https://robertsspaceindustries.com/*" }, function (tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
        // alert("Unfollow");
        var addList = document.getElementById("textarea").value;
        var activeTab = tabs[0];
        chrome.tabs.executeScript(activeTab.id, { file: 'content_script.js' }, function () {
            chrome.tabs.sendMessage(activeTab.id, { "action": 7, "list": addList });
        });
    });
}
function removefromList() {
    chrome.tabs.query({ url: "https://robertsspaceindustries.com/*" }, function (tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
        // alert("Unfollow");
        var remList = document.getElementById("textarea").value;
        var activeTab = tabs[0];
        chrome.tabs.executeScript(activeTab.id, { file: 'content_script.js' }, function () {
            chrome.tabs.sendMessage(activeTab.id, { "action": 8, "list": remList });
        });
    });
}
function ShowHideDiv() {
    var dvtext = document.getElementById("dvtext");
    dvtext.style.display = "block";
}


document.getElementById('Execute').addEventListener('click', ShowHideDiv)
document.getElementById('Add').addEventListener('click', addfromList)
document.getElementById('Remove').addEventListener('click', removefromList)
document.getElementById('follow').addEventListener('click', followORG);
document.getElementById('unfollow').addEventListener('click', unfollowORG);
document.getElementById('backUP').addEventListener('click', backUP);
document.getElementById('loadbackUP').addEventListener('click', loadbackUP);
document.getElementById('eraseALL').addEventListener('click', eraseALL);
document.getElementById('eraseBackup').addEventListener('click', eraseBackup); 