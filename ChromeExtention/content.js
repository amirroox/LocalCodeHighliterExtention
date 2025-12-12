chrome.storage.sync.get(['highlightEnabled'], (data) => {
    if (data.highlightEnabled === false) return;

    function getLanguageFromURL() {
        const path = window.location.pathname;
        const ext = path.split('.').pop();
        if (!ext) return 'clike';
        return ext;
    }

    const code = document.createElement('pre');
    const codeBlock = document.createElement('code');
    codeBlock.className = `language-${getLanguageFromURL()}`;
    codeBlock.textContent = document.body.textContent;
    code.appendChild(codeBlock);
    document.body.innerHTML = '';
    document.body.appendChild(code);
    Prism.highlightAll();

    let fontSize = 14;
    let fontFamily = 'Fira Code, Courier New, monospace';

    const systemFonts = [
        'Fira Code',
        'Monaco',
        'Menlo',
        'Consolas',
        'Courier New',
        'Courier',
        'monospace',
        'JetBrains Mono',
        'Source Code Pro',
        'IBM Plex Mono',
        'Roboto Mono',
        'Ubuntu Mono',
        'Inconsolata',
        'IRANSansWeb'
    ];

    const controls = document.createElement('div');
    controls.id = 'font-controls';

    const sizeDisplay = document.createElement('span');
    sizeDisplay.textContent = `Size: ${fontSize}px`;
    sizeDisplay.style.marginRight = '10px';

    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = 'A+';
    increaseBtn.onclick = () => {
        fontSize = Math.min(72, fontSize + 1);
        code.style.fontSize = fontSize + 'px';
        sizeDisplay.textContent = `Size: ${fontSize}px`;
        saveSettings();
    };

    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = 'A-';
    decreaseBtn.onclick = () => {
        fontSize = Math.max(8, fontSize - 1);
        code.style.fontSize = fontSize + 'px';
        sizeDisplay.textContent = `Size: ${fontSize}px`;
        saveSettings();
    };

    const inputSize = document.createElement('input');
    inputSize.type = 'number';
    inputSize.value = fontSize;
    inputSize.min = 8;
    inputSize.max = 72;
    inputSize.style.width = '50px';
    inputSize.onchange = () => {
        fontSize = Math.max(8, Math.min(72, parseInt(inputSize.value) || fontSize));
        inputSize.value = fontSize;
        code.style.fontSize = fontSize + 'px';
        sizeDisplay.textContent = `Size: ${fontSize}px`;
        saveSettings();
    };

    const fontSelect = document.createElement('select');
    fontSelect.id = 'font-selector';
    fontSelect.style.width = '150px';
    fontSelect.style.padding = '4px 8px';
    fontSelect.style.borderRadius = '4px';
    fontSelect.style.border = 'none';
    fontSelect.style.background = '#444';
    fontSelect.style.color = '#fff';
    fontSelect.style.cursor = 'pointer';

    systemFonts.forEach(font => {
        const option = document.createElement('option');
        option.value = font;
        option.textContent = font;
        fontSelect.appendChild(option);
    });

    fontSelect.value = fontFamily.split(',')[0].trim();
    fontSelect.onchange = () => {
        fontFamily = fontSelect.value + ', Courier New, monospace';
        code.style.fontFamily = fontFamily;
        const style_all = document.createElement('style');
        style_all.textContent = `* { font-family: ${fontFamily} !important; }`;
        document.head.appendChild(style_all);
        saveSettings();
    };

    const statusBtn = document.createElement('button');
    statusBtn.id = 'status-indicator';
    statusBtn.style.marginLeft = '10px';
    statusBtn.style.padding = '6px 12px';
    statusBtn.style.backgroundColor = '#4caf50';
    statusBtn.style.fontWeight = 'bold';
    statusBtn.textContent = 'ON';

    controls.appendChild(sizeDisplay);
    controls.appendChild(increaseBtn);
    controls.appendChild(decreaseBtn);
    controls.appendChild(inputSize);
    controls.appendChild(fontSelect);
    controls.appendChild(statusBtn);

    document.body.appendChild(controls);
    code.style.fontSize = fontSize + 'px';
    code.style.fontFamily = fontFamily;
    const style_all = document.createElement('style');
    style_all.textContent = `* { font-family: ${fontFamily} !important; }`;
    document.head.appendChild(style_all);

    function saveSettings() {
        chrome.storage.sync.set({
            fontSize: fontSize,
            fontFamily: fontFamily
        });
    }

    chrome.storage.sync.get(['fontSize', 'fontFamily'], (data) => {
        if (data.fontSize) {
            fontSize = data.fontSize;
            code.style.fontSize = fontSize + 'px';
            sizeDisplay.textContent = `Size: ${fontSize}px`;
            inputSize.value = fontSize;
        }
        if (data.fontFamily) {
            fontFamily = data.fontFamily;
            code.style.fontFamily = fontFamily;
            const style_all = document.createElement('style');
            style_all.textContent = `* { font-family: ${fontFamily} !important; }`;
            document.head.appendChild(style_all);
            fontSelect.value = fontFamily.split(',')[0].trim();
        }
    });
});