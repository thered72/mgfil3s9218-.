(async function() {
    // All EmulatorJS scripts with proper absolute CDN links
    const cdnScripts = {
        "emulator.min.js": "https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@4.2.3/data/emulator.min.js",
        "emulator.js": "https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@4.2.3/data/src/emulator.js",
        "emulator.min.css": "https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@4.2.3/data/emulator.min.css",
        "emulator.css": "https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@4.2.3/data/emulator.css",
        "nipplejs.js": "https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@4.2.3/data/src/nipplejs.js",
        "shaders.js": "https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@4.2.3/data/src/shaders.js",
        "storage.js": "https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@4.2.3/data/src/storage.js",
        "gamepad.js": "https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@4.2.3/data/src/gamepad.js",
        "GameManager.js": "https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@4.2.3/data/src/GameManager.js",
        "socket.io.min.js": "https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@4.2.3/data/src/socket.io.min.js",
        "compression.js": "https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@4.2.3/data/src/compression.js"
    };

    // Helper to load scripts
    function loadScript(file) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = cdnScripts[file] || file;
            script.onload = resolve;
            script.onerror = () => {
                console.error("Failed to load script:", file);
                resolve(); // continue anyway
            };
            document.head.appendChild(script);
        });
    }

    // Helper to load styles
    function loadStyle(file) {
        return new Promise((resolve, reject) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = cdnScripts[file] || file;
            link.onload = resolve;
            link.onerror = () => {
                console.error("Failed to load style:", file);
                resolve();
            };
            document.head.appendChild(link);
        });
    }

    // Load minified by default
    await loadScript("emulator.min.js");
    await loadStyle("emulator.min.css");

    // Emulator config
    const config = {};
    config.gameUrl = window.EJS_gameUrl;
    config.dataPath = "https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@4.2.3/data/";
    config.system = window.EJS_core;
    config.biosUrl = window.EJS_biosUrl;
    config.gameName = window.EJS_gameName;
    config.color = window.EJS_color;
    config.volume = window.EJS_volume;
    config.startOnLoad = window.EJS_startOnLoaded;
    config.fullscreenOnLoad = window.EJS_fullscreenOnLoaded;
    config.shaders = Object.assign({}, window.EJS_SHADERS, window.EJS_shaders ? window.EJS_shaders : {});
    // You can add more config options here if needed

    // Language loader (optional, safe fallback)
    try {
        if (window.EJS_language) {
            const langPath = `https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@4.2.3/data/localization/${window.EJS_language}.json`;
            const response = await fetch(langPath);
            config.language = window.EJS_language;
            config.langJson = await response.json();
        }
    } catch(e) {
        console.warn("Language JSON not loaded:", e);
    }

    // Attach emulator to a div
    if (!window.EJS_player) window.EJS_player = "#game";

    // Initialize EmulatorJS
    window.EJS_emulator = new EmulatorJS(window.EJS_player, config);

    // Event hooks
    if (typeof window.EJS_ready === "function") window.EJS_emulator.on("ready", window.EJS_ready);
    if (typeof window.EJS_onGameStart === "function") window.EJS_emulator.on("start", window.EJS_onGameStart);
    if (typeof window.EJS_onLoadState === "function") window.EJS_emulator.on("loadState", window.EJS_onLoadState);
    if (typeof window.EJS_onSaveState === "function") window.EJS_emulator.on("saveState", window.EJS_onSaveState);
    if (typeof window.EJS_onLoadSave === "function") window.EJS_emulator.on("loadSave", window.EJS_onLoadSave);
    if (typeof window.EJS_onSaveSave === "function") window.EJS_emulator.on("saveSave", window.EJS_onSaveSave);

})();
