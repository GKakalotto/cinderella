function main() {
    $ = el => {
        return document.getElementById(el);
    }

    $("save").addEventListener("click", e => {
        let work = {
            begin: $("begin").value,
            lunch: $("lunch").value,
            end: $("end").value
        }

        chrome.storage.local.set({ "work_time": work });
    });

    $("test").addEventListener("click", e => {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: "./image/icon.jpg",
            title: "弹窗测试",
            message: "这是一条来自 Cinderella 插件的通知。",
            requireInteraction: true
        });
    });

    chrome.storage.local.get(["work_time"], result => {
        if (result) {
            let work_time = result.work_time;
            if (work_time) {
                $("begin").value = work_time.begin;
                $("lunch").value = work_time.lunch;
                $("end").value = work_time.end;
            }
        }
    });
}

main();
