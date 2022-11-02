//*********************** VARIABLES ***********************//

var OPTwhere2copy;
var OPTwhat2copy;
var OPTformat;
var CBorder;
var CBnotification;

browser.browserAction.onClicked.addListener(() => {
    browser.storage.local.get({
        // Default Settings
        OPTwhere2copy: 'current',
        OPTwhat2copy: 'all',
        OPTformat: 'url',
        CBorder: false,
        CBnotification: true
    },
        function (data) {
        OPTwhere2copy = data.OPTwhere2copy;
        OPTwhat2copy = data.OPTwhat2copy;
        OPTformat = data.OPTformat;
        CBorder = data.CBorder;
        CBnotification = data.CBnotification;
        getAllUrl();
    });
});

var copiedNotification = (tit, msg) => {
    if (CBnotification == true) {
    browser.notifications.create('onCopiedNotification', {
        "type": "list",
        "iconUrl": browser.runtime.getURL("img/icon.svg"),
        "title": tit,
        "message": msg
    });
    setTimeout(function () {
        browser.notifications.clear('onCopiedNotification');
    }, 3000);
    }
}

var localization = () => {
    document.querySelectorAll('[data-i18n]')
    .forEach((node) => {
        node.textContent = browser.i18n.getMessage(node.dataset.i18n);
    });
}

var getAllUrl = () => {
    var notimsg = browser.i18n.getMessage("windows") + ': '; //n
    switch (OPTwhere2copy) {
    case 'current':
        var querying = browser.tabs.query({
                currentWindow: true
            });
        notimsg += browser.i18n.getMessage("current") + '\n';
        console.log(notimsg);
        break;
    case 'allwindows':
        var querying = browser.tabs.query({});
        notimsg += browser.i18n.getMessage("allwindows") + '\n';
        console.log(notimsg);
        break;
    case 'currenttab':
        var querying = browser.tabs.query({currentWindow: true, active: true});
        notimsg += browser.i18n.getMessage("currenttab") + '\n';
        console.log(notimsg);
        break;
    
    }

    querying.then((tabs) => {
        notimsg += browser.i18n.getMessage("url") + ': ';

        var num = 0;
        var res = '';
        var fmt = '{url}'; //default format

        switch (OPTwhat2copy) {
        case 'all':
            notimsg += browser.i18n.getMessage("all") + '\n';
            break;
        case 'web':
            notimsg += browser.i18n.getMessage("web") + '\n';
            break;
        }

        notimsg += browser.i18n.getMessage("format") + ': ';

        switch (OPTformat) {
        case 'url':
            fmt = '{url}';
            notimsg += browser.i18n.getMessage("url") + '\n';
            break;
        case 'title':
            fmt = '{title}\n{url}\n';
            notimsg += browser.i18n.getMessage("title") + '\n';
            break;
        case 'markdown':
            fmt = '[{title}]({url})';
            notimsg += browser.i18n.getMessage("markdown") + '\n';
            break;
        }
        
        notimsg += browser.i18n.getMessage("order") + ': ';
        
        if (CBorder == true) {
            notimsg += browser.i18n.getMessage("reverse") + '\n';
            tabs = tabs.reverse()
        } else {
            notimsg += browser.i18n.getMessage("normal") + '\n';
        } 
        
        for (let tab of tabs) { //the main loop
            var urlstring = tab.url;
            var pattern = '^(?:https?)\:\/\/.*'
                var regex = new RegExp(pattern, 'i');

            if ((OPTwhat2copy == 'web') && !(urlstring.match(regex))) {
                //skip this url
            } else {
                res += fmt.replace(/{title}/g, tab.title).replace(/{url}/g, tab.url).replace(/\\t/g, "\t").replace(/\\n/g, "\n");
                res += '\n';
                num += 1
                console.log(tab.url);
                console.log(num);
            }
        } //the main loop

        var ttt = browser.i18n.getMessage("notificationTitle") + ' - ' + browser.i18n.getMessage("numb") + ': ' + num
            navigator.clipboard.writeText(res).then(copiedNotification(ttt, notimsg));
    });
};

var createItems = () => {
    /* Option */
    var msgName = browser.i18n.getMessage('options');
    browser.contextMenus.create({
        id: 'calu-options',
        title: msgName,
        icons: {
            16: "img/icon.svg",
            32: "img/icon.svg"
        },
        contexts: ["page_action", "browser_action"]
    });
};

browser.contextMenus.onClicked.addListener((info) => {
    switch (info.menuItemId) {
    case 'calu-options':
        browser.runtime.openOptionsPage();
        break;
    }
});

var initializeAddon = () => {
    createItems();
};

initializeAddon();