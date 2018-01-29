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
        chrome.storage.sync.get('contacts', function (r) {
            var gotContacts;
            gotContacts = r['contacts'];
            chrome.tabs.executeScript(activeTab.id, { file: 'content_script.js' }, function () {
                chrome.tabs.sendMessage(activeTab.id, { "action": 4, "list": gotContacts });
            });
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
function backUP2text() {
    chrome.tabs.query({ url: "https://robertsspaceindustries.com/*" }, function (tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
        // alert("Unfollow");
        var remList = document.getElementById("textarea").value;
        var activeTab = tabs[0];
        chrome.tabs.executeScript(activeTab.id, { file: 'content_script.js' }, function () {
            chrome.tabs.sendMessage(activeTab.id, { "action": 9 });
        });
    });
}
function ShowHideDiv() {
    var dvtext = document.getElementById("dvtext");
    dvtext.style.display = "block";
}
function ShowHideDiv2() {
    var dvtext2 = document.getElementById("dvtext2");
    dvtext2.style.display = "block";
}
function ShowHideDiv3() {
    var dvtext3 = document.getElementById("dvtext3");
    dvtext3.style.display = "block";
}
function loadData() {
    document.forms['myform'].elements['myfile'].onchange = function (evt) {
        if (!window.FileReader) return; // Browser is not compatible

        var reader = new FileReader();

        reader.onload = function (evt) {
            if (evt.target.readyState != 2) return;
            if (evt.target.error) {
                alert('Error while reading file');
                return;
            }

            filecontent = evt.target.result;
            function restoreFromtext(results) {
                chrome.tabs.query({ url: "https://robertsspaceindustries.com/*" }, function (tabs) {
                    // query the active tab, which will be only one tab
                    //and inject the script in it
                    // alert("Unfollow");
                    var addList = results;
                    var activeTab = tabs[0];
                    chrome.tabs.executeScript(activeTab.id, { file: 'content_script.js' }, function () {
                        chrome.tabs.sendMessage(activeTab.id, { "action": 7, "list": addList });
                    });
                });
            }
            restoreFromtext(evt.target.result);
            document.forms['myform'].elements['text'].value = evt.target.result;
        };

        reader.readAsText(evt.target.files[0]);
    };
}


document.getElementById('Execute').addEventListener('click', ShowHideDiv)
document.getElementById('bkupOptions').addEventListener('click', ShowHideDiv3)
document.getElementById('myfile').addEventListener('click', loadData)
document.getElementById('destruct').addEventListener('click', ShowHideDiv2)
document.getElementById('Add').addEventListener('click', addfromList)
document.getElementById('backUP2text').addEventListener('click', backUP2text)
document.getElementById('Remove').addEventListener('click', removefromList)
document.getElementById('follow').addEventListener('click', followORG);
document.getElementById('unfollow').addEventListener('click', unfollowORG);
document.getElementById('backUP').addEventListener('click', backUP);
document.getElementById('loadbackUP').addEventListener('click', loadbackUP);
document.getElementById('eraseALL').addEventListener('click', eraseALL);
document.getElementById('eraseBackup').addEventListener('click', eraseBackup); 