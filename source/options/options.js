// Run when page loads
window.onload = () => {

    // Settings
    updateUI();
    // Update Settings
    document.getElementById('OPTwhere2copy').onchange = () => {
        saveSettings();
    };
    document.getElementById('OPTwhat2copy').onchange = ()  =>{
        saveSettings();
    };
    document.getElementById('OPTformat').onchange = () => {
        saveSettings();
    };
    document.getElementById('CBorder').onchange = () => {
        saveSettings();
    };
    document.getElementById('CBnotification').onchange = () => {
        saveSettings();
    };
    // Localization
    localization();
}
// Load Settings
var updateUI = () => {
    // Default List
    browser.storage.local.get({
        // Default Settings
        OPTwhere2copy: 'current',
        OPTwhat2copy: 'all',
        OPTformat: 'url',
        CBorder: false,
        CBnotification: true
    },
        (data) => {
        // Update  GUI
        document.getElementById('OPTwhere2copy').value = data.OPTwhere2copy;
        document.getElementById('OPTwhat2copy').value = data.OPTwhat2copy;
        document.getElementById('OPTformat').value = data.OPTformat;
        document.getElementById('CBorder').checked  = data.CBorder;
        document.getElementById('CBnotification').checked  = data.CBnotification;
    })
};

// Save Settings
var saveSettings = () => {

    browser.storage.local.set({
        OPTwhere2copy: document.getElementById('OPTwhere2copy').value,
        OPTwhat2copy: document.getElementById('OPTwhat2copy').value,
		OPTformat: document.getElementById('OPTformat').value,
 		CBorder: document.getElementById('CBorder').checked,
        CBnotification: document.getElementById('CBnotification').checked,
    }, () =>{
        //console.log('saved');
    });
};


// Localization
var localization = () => {
    document.querySelectorAll('[data-i18n]')
    .forEach((node) => {
        node.textContent = browser.i18n.getMessage(node.dataset.i18n);
    });
}
