chrome.action.onClicked.addListener(async (tab) => {
    if (!isCodePage(tab.url)) return;
    
    try {
        const data = await chrome.storage.sync.get(['highlightEnabled']);
        const newState = !(data.highlightEnabled ?? true);
        await chrome.storage.sync.set({ highlightEnabled: newState });
        updateIcon(tab.id, newState);
        if (tab.id) chrome.tabs.reload(tab.id);
    } catch (error) {
        console.error('Error in onClicked:', error);
    }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        
        if (!isCodePage(tab.url)) {
            chrome.action.setIcon({
                path: "icons/icon-off-128.png",
                tabId: activeInfo.tabId
            });
            chrome.action.disable(activeInfo.tabId);
            return;
        }
        
        chrome.action.enable(activeInfo.tabId);
        const data = await chrome.storage.sync.get(['highlightEnabled']);
        updateIcon(activeInfo.tabId, data.highlightEnabled !== false);
    } catch (error) {
        console.error('Error in onActivated:', error);
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        try {
            if (isCodePage(tab.url)) {
                chrome.action.enable(tabId);
                const data = await chrome.storage.sync.get(['highlightEnabled']);
                updateIcon(tabId, data.highlightEnabled !== false);
            } else {
                chrome.action.disable(tabId);
            }
        } catch (error) {
            console.error('Error in onUpdated:', error);
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
        path: isEnabled ? "icons/icon-128.png" : "icons/icon-off-128.png",
        tabId: tabId
    });
}