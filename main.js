let working = {
    morning: "09:00",
    noon: "12:00",
    afternoon: "18:00"
};

function main() {
    $ = el => document.getElementById(el);

    $("save").addEventListener("click", () => {
        working.morning = $("morning").value;
        working.noon = $("noon").value;
        working.afternoon = $("afternoon").value;

        chrome.runtime.sendMessage({
            type: "save",
            data: working,
            popupEnabled: $("popup").checked
        });
        alert("保存成功！");
    });

    $("test").addEventListener("click", () => {
        chrome.runtime.sendMessage({ type: "test", data: null });
    });

    chrome.storage.local.get(["working", "popupEnabled"], value => {
        for (let i in working) {
            if (value && value.working && value.working[i]) {
                working[i] = value.working[i].timeString;
            }
            $(i).value = working[i];
        }
        $("popup").checked = !!(value && value.popupEnabled);
    });
}

main();
