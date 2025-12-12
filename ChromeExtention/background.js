chrome.action.onClicked.addListener((tab) => {
    if (!isCodePage(tab.url)) return;
    
    chrome.storage.sync.get(['highlightEnabled'], (data) => {
        const newState = !(data.highlightEnabled ?? true);
        chrome.storage.sync.set({ highlightEnabled: newState }, () => {
            updateIcon(tab.id, newState);
            if (tab.id) chrome.tabs.reload(tab.id);
        });
    });
});

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (!isCodePage(tab.url)) {
            chrome.action.setIcon({
                path: "icons/off.png",
                tabId: activeInfo.tabId
            });
            chrome.action.disable(activeInfo.tabId);
            return;
        }
        
        chrome.action.enable(activeInfo.tabId);
        chrome.storage.sync.get(['highlightEnabled'], (data) => {
            updateIcon(activeInfo.tabId, data.highlightEnabled !== false);
        });
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        if (isCodePage(tab.url)) {
            chrome.action.enable(tabId);
            chrome.storage.sync.get(['highlightEnabled'], (data) => {
                updateIcon(tabId, data.highlightEnabled !== false);
            });
        } else {
            chrome.action.disable(tabId);
        }
    }
});

function isCodePage(url) {
    if (!url) return false;
    const codeExtensions = ['php', 'php3', 'php4', 'php5', 'phtml', 'js', 'jsx', 'tsx', 'ts', 'py', 'java', 'cpp', 'c', 'cs', 'rb', 'go', 'rs', 'swift', 'kotlin', 'kt', 'scala', 'clj', 'cljs', 'r', 'R', 'html', 'htm', 'xhtml', 'css', 'scss', 'sass', 'less', 'xml', 'xsl', 'json', 'jsonld', 'sql', 'mysql', 'plsql', 'sh', 'bash', 'zsh', 'fish', 'ksh', 'yaml', 'yml', 'toml', 'ini', 'cfg', 'conf', 'gradle', 'groovy', 'properties', 'env', 'dockerfile', 'Dockerfile', 'makefile', 'Makefile', 'cmake', 'm', 'mm', 'pl', 'pm', 'lua', 'vim', 'el', 'lisp', 'scheme', 'clojure', 'haskell', 'hs', 'ml', 'mli', 'fs', 'fsx', 'fsi', 'pas', 'pp', 'puppet', 'chef', 'erb', 'haml', 'slim'];
    const extension = url.split('.').pop().split(/[?#]/)[0].toLowerCase();
    return codeExtensions.includes(extension);
}

function updateIcon(tabId, isEnabled) {
    chrome.action.setIcon({
        path: isEnabled ? "icons/on.png" : "icons/off.png",
        tabId: tabId
    });
}