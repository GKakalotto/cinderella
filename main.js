let working = null;

function main() {
    $ = el => {
        return document.getElementById(el);
    }

    $("save").addEventListener("click", e => {
        working.morning = $("morning").value;
        working.noon = $("noon").value;
        working.afternoon = $("afternoon").value;

        chrome.runtime.sendMessage({ type: "save", data: working });
        alert("保存成功！");
    });

    $("test").addEventListener("click", e => {
        chrome.runtime.sendMessage({ type: "test", data: null });
    });

    chrome.storage.local.get(["working"], value => {
        if (value && value.working) {
            working = value.working;
            for (let i in working) {
                $(i).value = working[i].timeString;
            }
        }
    });
}

main();
