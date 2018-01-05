// Org follow script credits go to nitzel
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            var uri = window.location.href;

            //Grab URLs to look for citizen URL in My RSI - ensures you're logged in
            console.log("Running it");
            var arr = [], l = document.links; for (var i = 0; i < l.length; i++) {if (l[i].href.indexOf("https://robertsspaceindustries.com/citizens/") !== -1) { arr.push(l[i].href); }};arr.push("DONE");
            var tablink = window.location.toString()
            if (tablink.indexOf('https://robertsspaceindustries.com/orgs/') !== -1 && arr[0].indexOf("https://robertsspaceindustries.com/citizens/") !== -1) {
                var orgac = tablink.split('https://robertsspaceindustries.com/orgs/')[1];
                if (orgac.indexOf('/') !== -1) { orgac = orgac.split('/')[0]; }
                alert("Executing contact add on Org: " + orgac);
                var PHOMemberScript =
                    {
                        baseAddressLive: "https://robertsspaceindustries.com/",
                        baseAddressPtu: "https://ptu.cloudimperiumgames.com/",
                        maximumContactsPrefilCount: 250,    // The maximum number of contacts this script will add

                        addedMembers: ["Start"],
                        addErrors: [],

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

                            if (!follow || this.addErrors.length != this.addedMembers.length || (that.addedMembers.length < that.maximumContactsPrefilCount && that.addedMembers.indexOf(name.toLowerCase()) < 0)) {
                                $.ajax({
                                    async: false,
                                    type: "post",
                                    url: that.getBaseAddress() + "api/contacts/" + (follow ? "add" : "erase"),
                                    success: function (d) {
                                        if (d.msg == 'You have reached your limit of 250 contacts') {
                                            that.addErrors.push(250);
                                        }
                                        if (d.msg != 'Validation failed' && d.msg != 'ErrCannotAddItself' && d.msg != 'ErrNoAccountForNickname') {
                                            // tell the user if it worked
                                            console.log((follow ? "Following " : "Unfollowing ") + name + " -> " + d.msg);

                                            if (follow)
                                                if (that.addedMembers[0] == 'Start') {
                                                    that.addedMembers.pop("Start");
                                                }
                                                that.addedMembers.push(name.toLowerCase());
                                   
                                        }
                                        
                                    },
                                    data: JSON.stringify({
                                        nickname: name
                                    }),
                                    headers: that.__hs()
                                });
                            }
                        },

                        /**
                         * Erase ALL members in your contacts list.
                         */
                        eraseAll: function () {
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

                            page = page || 1;
                            $.ajax({ // request a page of members
                                async: false,
                                type: "post",
                                url: that.getBaseAddress() + "api/orgs/getOrgMembers",
                                success: function (d) {
                                    //console.debug(d); // debug received data
                                    if (d.data && d.data.html) { // still more members available
                                        // parse to DOM object
                                        dt = $('<div></div');
                                        dt.html(d.data.html);
                                        // (un-)follow all members
                                        $('.nick', dt).each(function (i, field) {
                                            if (that.addErrors.length != that.addedMembers.length)
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

                            $.each(members, function (i, name) {
                                that.changeFollow(name, true);
                            });
                        },

                        /**
                        * Remove old members
                        */
                        removeMembers: function (oldmembers) {
                            var that = this;

                            $.each(oldmembers, function (i, name) {
                                that.changeFollow(name, false);
                            });
                        },

                        /**
                        * Execute the script.
                        **/
                        execute: function () {

                            this.changeOrgFollow(orgac, true);

                            if (this.addErrors.length == this.addedMembers.length) {
                                alert('You have reached your limit of 250 contacts.');
                            } else {
                                alert('DONE! Added ' + this.addedMembers.length + " members. With " + this.addErrors.length + " errors.");
                            }

                            this.addedMembers.length = [];
                        }
                    };
                PHOMemberScript.execute();
                console.log("Ran it");
            } else {
                if (tablink.indexOf('https://robertsspaceindustries.com/orgs/') === -1 && arr[0].indexOf("https://robertsspaceindustries.com/citizens/") !== -1) {
                    alert('Please navigate to an Org page on robertsspaceindustries.com then click the StarCync button again');
                    return "";
                }
                if (tablink.indexOf('https://robertsspaceindustries.com/orgs/') !== -1 && arr[0].indexOf("https://robertsspaceindustries.com/citizens/") === -1) {
                    alert('Please login to robertsspaceindustries.com then click the StarCync button again');
                    return "";
                }
                if (tablink.indexOf('https://robertsspaceindustries.com/orgs/') === -1 && arr[0].indexOf("https://robertsspaceindustries.com/citizens/") === -1) {
                    alert('Please login to robertsspaceindustries.com, navigate to an Org page, then click the StarCync button again');
                    return "";
                }
                alert('Unknown error. Please contact starcync@gmail.com');
            }
        }
    }
);