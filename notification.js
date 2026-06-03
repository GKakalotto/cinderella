const params = new URLSearchParams(location.search);

document.getElementById("title").textContent = params.get("title") || "Cinderella";
document.getElementById("message").textContent = params.get("message") || "";

chrome.windows.getCurrent(win => {
    chrome.windows.update(win.id, { focused: true, drawAttention: true });
});

window.focus();
