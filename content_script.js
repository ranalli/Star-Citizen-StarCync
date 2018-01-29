
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == 1) {

            executeScript(1);
            request.action = 0;
        }

        if (request.action == 2) {

            executeScript(2);
            request.action = 0;
        }


        if (request.action == 3) {

            executeScript(3);
            request.action = 0;
        }

        if (request.action == 4) {
            var loadedTact = request.list;
            executeScript(4, loadedTact);
            request.action = 0;
        }

        if (request.action == 5) {

            executeScript(5);
            request.action = 0;
        }


        if (request.action == 6) {
   
            executeScript(6);
            request.action = 0;
        }
        if (request.action == 7) {
            var grabList = request.list;
            executeScript(7, grabList);
            request.action = 0;
        }
        if (request.action == 8) {
            var grabList = request.list;
            executeScript(8, grabList);
            request.action = 0;
        }
        if (request.action == 9) {

            executeScript(9);
            request.action = 0;
        }

    }
);
function executeScript(GOT, grabList) {


        var gotAction = GOT;
        var gotContacts;

        var uri = window.location.href;

        if (gotAction == 1 || gotAction == 2 || gotAction == 3 || gotAction == 4 || gotAction == 5 || gotAction == 6 || gotAction == 7 || gotAction == 8 || gotAction == 9) {
            if (gotAction == 1) {
                var whatACT = "Follow";
            }
            if (gotAction == 2) {
                var whatACT = "Unfollow";
            }
            if (gotAction == 3) {
                var whatACT = "Backup all";
            }
            if (gotAction == 4) {
                var whatACT = "Load backups";
            }
            if (gotAction == 5) {
                var whatACT = "Erase all";
            }
            if (gotAction == 6) {
                var whatACT = "Erase backup";
            }
            if (gotAction == 7) {
                var whatACT = "Add from list";
            }
            if (gotAction == 8) {
                var whatACT = "Remove from list";
            }
            if (gotAction == 9) {
                var whatACT = "Back to text file";
            }
        } else { whatACT = "Unknown"; }

        //Grab URLs to look for citizen URL in My RSI - ensures you're logged in
        console.log("Starting Star Citizen : StarCync - Running a " + whatACT);

        var arr = [], l = document.links; for (var i = 0; i < l.length; i++) { if (l[i].href.indexOf("https://robertsspaceindustries.com/account/settings") !== -1) { arr.push(l[i].href); } }; arr.push("DONE");
        var tablink = window.location.toString()

        if (tablink.indexOf('https://robertsspaceindustries.com/orgs/') !== -1) { var orgac = tablink.split('https://robertsspaceindustries.com/orgs/')[1]; } else { orgac = "UNDEFINED"; }
        if (orgac.indexOf('/') !== -1) { orgac = orgac.split('/')[0]; }



        var PHOMemberScript =
            {

                baseAddressLive: "https://robertsspaceindustries.com/",
                baseAddressPtu: "https://ptu.cloudimperiumgames.com/",
                maximumContactsPrefilCount: 250,    // The maximum number of contacts this script will add

                addedMembers: ["Start"],
                removedMembers: ["Start"],
                backedUpMembers: ["Start"],
                addErrors: ["None"],

                // Get the server base address. Supports PTU and live.
                getBaseAddress: function () {
                    if ($("#ptubar").length)
                        return this.baseAddressPtu;

                    return this.baseAddressLive;
                },
                // getCookie from http://stackoverflow.com/a/11767598 by Paul Sweatte
                // Extracts a cookie from document.cookie
                getCookie: function (cookiename) {
                    // Get name followed by anything except a semicolon
                    var cookiestring = RegExp("" + cookiename + "[^;]+").exec(document.cookie);
                    // Return everything after the equal sign
                    return unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
                },

                // additional headers, here we only use the RSI token from the cookie.
                __hs: function () {
                    return { "X-Rsi-Token": this.getCookie('Rsi-Token') };
                },

                /**
                 * Follow one Star Citizen.
                 * name is the nickname/handle of the player.
                 * follow=true -> follow, follow=false -> unfollow
                 */
                changeFollow: function (name, follow) {
                    var that = this;
                    if (!follow || this.addErrors[0] != "250" || (that.addedMembers.length < that.maximumContactsPrefilCount && that.addedMembers.indexOf(name.toLowerCase()) < 0)) {
                        $.ajax({
                            async: false,
                            type: "post",
                            url: that.getBaseAddress() + "api/contacts/" + (follow ? "add" : "erase"),
                            success: function (d) {
                                if (d.msg != 'Validation failed' && d.msg != 'ErrCannotAddItself' && d.msg != 'ErrNoAccountForNickname') {
                                    // tell the user if it worked
                                    if (d.msg == 'You have reached your limit of 250 contacts') {
                                        if (that.addErrors[0] == 'None') {
                                            that.addErrors.pop("None");
                                        }
                                        that.addErrors.push("250");
                                        that.addErrors.push(that.addedMembers.length);
                                    } else {
                                        //console.log(follow);
                                        if (follow) {
                                            if (that.addedMembers[0] == 'Start') {
                                                that.addedMembers.pop("Start");
                                            }
                                            console.log((follow ? "Following " : "Unfollowing ") + name + " -> " + d.msg);
                                            that.addedMembers.push(name.toLowerCase());
                                        } else {
                                            if (that.removedMembers[0] == 'Start') {
                                                that.removedMembers.pop("Start");
                                            }
                                            console.log((follow ? "Following " : "Unfollowing ") + name + " -> " + d.msg);
                                            that.removedMembers.push(name.toLowerCase());

                                        }
                                    }
                                }

                            },
                            data: JSON.stringify({
                                nickname: name
                            }),
                            headers: that.__hs()
                        });
                    }
                },

                addbackUp: function (name) {
                    var that = this;
                    if (that.backedUpMembers[0] == 'Start') {
                        that.backedUpMembers.pop("Start");
                    }
                    if (that.backedUpMembers.indexOf(name) === -1) {
                        that.backedUpMembers.push(name);
                    }

                },


                backupALL: function (page) {
                    //console.log("backupALL ");
                    var that = this;
                    page = page || 1;
                    $.ajax({ // request a page of members
                        async: false,
                        type: "post",
                        url: that.getBaseAddress() + "api/contacts/list",
                        success: function (d) {
                            //console.debug(d);
                            if (d.data.resultset.length) { // still more members available
                                $.each(d.data.resultset, function (i, field) {
                                    that.addbackUp(field.nickname);
                                });
                                // load next charge/page of members
                                that.backupALL(page + 1);
                            }
                        },
                        data: JSON.stringify({
                            page: page,
                            query: ""
                        }),
                        headers: that.__hs()
                    });
                },

                /**
                 * Erase ALL members in your contacts list.
                 */
                eraseAll: function () {
                    //console.log("Erase all");
                    var that = this;
                    $.ajax({ // request a page of members
                        async: false,
                        type: "post",
                        url: that.getBaseAddress() + "api/contacts/list",
                        success: function (d) {
                            //console.debug(d);
                            if (d.data.resultset.length) { // still more members available
                                $.each(d.data.resultset, function (i, field) {
                                    that.changeFollow(field.nickname, false);
                                });
                                // load next charge/page of members
                                that.eraseAll();
                            }
                        },
                        data: JSON.stringify({
                            page: 1,
                            query: ""
                        }),
                        headers: that.__hs()
                    });
                },

                /**
                 * Follow all members of an organization
                 * sid is the SID, Spectrum ID/handle of the organization.
                 * follow=true -> follow, follow=false -> unfollow
                 * page defaults to 1, dont use it.
                 */
                changeOrgFollow: function (sid, follow, page) {
                    var that = this;
                    //console.log("changeOrgFollow");
                    page = page || 1;
                    $.ajax({ // request a page of members
                        async: false,
                        type: "post",
                        url: that.getBaseAddress() + "api/orgs/getOrgMembers",
                        success: function (d) {
                            //console.log("changeOrgFollowSucc");
                            //console.debug(d); // debug received data
                            if (d.data && d.data.html) { // still more members available
                                // parse to DOM object
                                dt = $('<div></div');
                                dt.html(d.data.html);
                                // (un-)follow all members
                                $('.nick', dt).each(function (i, field) {
                                    if (that.addErrors[0] != "250")
                                        that.changeFollow(field.innerHTML, follow);
                                });
                                // load next charge/page of members
                                that.changeOrgFollow(sid, follow, page + 1);
                            }
                        },
                        data: JSON.stringify({
                            symbol: sid.toUpperCase(),
                            page: page
                        }),
                        headers: that.__hs()
                    });
                },

                /**
                * Append extra members
                */
                appendMembers: function (members) {
                    var that = this;
                    //console.log("appendMember");
                    $.each(members, function (i, name) {
                        that.changeFollow(name, true);
                    });
                },

                /**
                * Remove old members
                */
                removeMembers: function (oldmembers) {
                    var that = this;
                    //console.log("removeMember");
                    $.each(oldmembers, function (i, name) {
                        that.changeFollow(name, false);
                    });
                },

                /**
                * Execute the script.
                **/
                execute: function () {

                    console.log("Executing main functions");
                    

                    if (gotAction == 1 || gotAction == 2 ) {


                        if (tablink.indexOf('https://robertsspaceindustries.com/orgs/') !== -1 && arr[0].indexOf("https://robertsspaceindustries.com/account/settings") !== -1) {

                            if (gotAction == 1) {
                                alert("Running " + whatACT + " on " + orgac);
                                this.changeOrgFollow(orgac, true);
                                if (this.addedMembers[0] != 'Start') {
                                    if (this.addErrors[0] == "250") {
                                        //console.log(this.addedMembers);
                                        if (this.addedMembers.length >= 1 && this.addedMembers[0] != 'Start') {
                                            if (this.addedMembers.length == 1) {
                                                alert('You have reached your limit of 250 contacts but [' + this.addedMembers[0] + "] from [" + orgac + "] was added to your list.");
                                            } else {
                                                alert('You have reached your limit of 250 contacts but [' + this.addedMembers.length + "] members from [" + orgac + "] were added to your list.");
                                            }
                                        } else {
                                            alert('You have reached your limit of 250 contacts.');
                                        }
                                    } else {
                                        alert('DONE! Added ' + this.addedMembers.length + " " + orgac + " members.");
                                    }
                                } else { alert('No members to add'); request.action = 0; }
                                gotAction == 0;

                            }

                            if (gotAction == 2) {
                                alert("Unfollowing " + orgac);
                                this.changeOrgFollow(orgac, false);
                                console.log(this.removedMembers);
                                alert('DONE! Removed ' + (this.removedMembers.length - 1) + " " + orgac + " members.");
                                gotAction == 0;

                            }
                        } else {
                            if (tablink.indexOf('https://robertsspaceindustries.com/orgs/') === -1 && arr[0].indexOf("https://robertsspaceindustries.com/account/settings") !== -1) {
                                alert('Please navigate to an Org page on robertsspaceindustries.com then click the follow or unfollow org button again');
                                return "";
                            }
                            if (tablink.indexOf('https://robertsspaceindustries.com/orgs/') !== -1 && arr[0].indexOf("https://robertsspaceindustries.com/account/settings") === -1) {
                                alert('Please login to robertsspaceindustries.com then click the follow or unfollow org button again');
                                return "";
                            }
                            if (tablink.indexOf('https://robertsspaceindustries.com/orgs/') === -1 && arr[0].indexOf("https://robertsspaceindustries.com/account/settings") === -1) {
                                alert('Please login to robertsspaceindustries.com, navigate to an Org page, then click the follow or unfollow org button again');
                                return "";
                            }
                            alert('Unknown error. Please contact starcync@gmail.com');
                        }
                    }

                    if (gotAction == 3) {
                        if (arr[0].indexOf("https://robertsspaceindustries.com/account/settings") !== -1) {
                            alert("Backing up all contacts");
                            if (this.backedUpMembers[0] == 'Start') {
                                this.backedUpMembers.pop("Start");
                            }
                            this.backupALL();
                            console.log(this.backedUpMembers);
    
                            if (this.backedUpMembers.length != 0) {
                                chrome.storage.sync.set({ contacts: this.backedUpMembers }, function () {
                                    console.log('Names saved');
                                });
                                alert('DONE! Backed up ' + this.backedUpMembers.length + " members.");
                            } else { alert("No members to backup.");}
      
                        } else {
                            alert('Please login to robertsspaceindustries.com then click the backup button again');
                        }
                    }

                    if (gotAction == 4) {
                        if (arr[0].indexOf("https://robertsspaceindustries.com/account/settings") !== -1) {
                            alert("Loading Chrome Sync backup to RSI contacts");
                            var gotContacts = grabList;
                            console.log(gotContacts);
                            this.appendMembers(gotContacts);
                            if (this.addedMembers[0] != 'Start') {
                                if (this.addErrors[0] == "250") {
                                    //console.log(this.addedMembers);
                                    if (this.addedMembers.length >= 1 && this.addedMembers[0] != 'Start') {
                                        if (this.addedMembers.length == 1) {
                                            alert('You have reached your limit of 250 contacts but [' + this.addedMembers[0] + "] from [" + orgac + "] was added to your list.");
                                        } else {
                                            alert('You have reached your limit of 250 contacts but [' + this.addedMembers.length + "] members from [" + orgac + "] were added to your list.");
                                        }
                                    } else {
                                        alert('You have reached your limit of 250 contacts.');
                                    }
                                } else {
                                    alert('DONE! Added ' + this.addedMembers.length + " members.");
                                }
                            } else { alert('No members to add'); request.action = 0; }
                            gotAction == 0;


                        } else {
                            alert('Please login to robertsspaceindustries.com then click the chrome sync to rsi contacts button again');
                        }
                    }

                    if (gotAction == 5) {
                        if (arr[0].indexOf("https://robertsspaceindustries.com/account/settings") !== -1) {
                            alert("Erasing all RSI Contacts");
                            this.eraseAll();
                            console.log(this.removedMembers);
                            if (this.removedMembers[0] == 'Start') {
                                alert('No contacts to remove.');
                            } else {
                                alert('DONE! Removed ' + this.removedMembers.length + " members.");
                            }
                            gotAction == 0;
                        } else {
                            alert('Please login to robertsspaceindustries.com then click the erase all button again');
                        }
                    }

                    if (gotAction == 6) {
                        if (arr[0].indexOf("https://robertsspaceindustries.com/account/settings") !== -1) {
                            alert("Erasing Chrome Sync backup");
                            chrome.storage.sync.remove(['contacts']);
                            alert("Backup erased");
                        }
                    }
                    if (gotAction == 7) {
                        if (arr[0].indexOf("https://robertsspaceindustries.com/account/settings") !== -1) {
                            grabListprep = grabList.replace(/[^0-9^A-z,]/g, '');
                            var prepped = grabListprep.replace(/\n/g, ",").split(",");
                            alert("Adding members from list");
                            this.appendMembers(prepped);
                            if (this.addedMembers[0] != 'Start') {
                                if (this.addErrors[0] == "250") {
                                    //console.log(this.addedMembers);
                                    if (this.addedMembers.length >= 1 && this.addedMembers[0] != 'Start') {
                                        if (this.addedMembers.length == 1) {
                                            alert('You have reached your limit of 250 contacts but [' + this.addedMembers[0] + " was added to your list.");
                                        } else {
                                            alert('You have reached your limit of 250 contacts but [' + this.addedMembers.length + " were added to your list.");
                                        }
                                    } else {
                                        alert('You have reached your limit of 250 contacts.');
                                    }
                                } else {
                                    alert('DONE! Added ' + (this.addedMembers.length + 2) + " contacts.");
                                }
                            } else { alert('No members to add'); request.action = 0; }
                            gotAction == 0;
                            console.log(grabListprep);
                            console.log(prepped);
                        }
                    }
                    if (gotAction == 8) {
                        if (arr[0].indexOf("https://robertsspaceindustries.com/account/settings") !== -1) {
                            grabListprep = grabList.replace(/[^0-9^A-z,]/g, '');
                            var prepped = grabListprep.replace(/\n/g, ",").split(",");
                            this.removeMembers(prepped);
                            alert('DONE! Removed ' + (this.removedMembers.length - 1) + " contacts.");
                            console.log(grabListprep);
                            console.log(prepped);
                        }
                    }

                    if (gotAction == 9) {
                        if (arr[0].indexOf("https://robertsspaceindustries.com/account/settings") !== -1) {
                            alert("Backing up all contacts");
                            if (this.backedUpMembers[0] == 'Start') {
                                this.backedUpMembers.pop("Start");
                            }
                            this.backupALL();
                            console.log(this.backedUpMembers);

                            if (this.backedUpMembers.length != 0) {

                                var textToSave = this.backedUpMembers.toString();
                                var hiddenElement = document.createElement('a');

                                hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
                                hiddenElement.target = '_blank';
                                hiddenElement.download = 'RSIMembers.txt';
                                hiddenElement.click();
                                alert('DONE! Backed up ' + this.backedUpMembers.length + " members.");
                            } else { alert("No members to backup."); }

                        } else {
                            alert('Please login to robertsspaceindustries.com then click the backup button again');
                        }
                    }


                }

            };




        PHOMemberScript.execute();
        gotAction = 0;
   
}
