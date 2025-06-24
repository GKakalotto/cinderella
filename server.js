let HHE = 18;
let HHB = 9;
let MM = 0;
let work = {
    begin: "09:00",
    lunch: "12:00",
    end: "18:00"
};

function MessageBox(title, message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: "./image/icon.jpg",
        title: title,
        message: message,
        requireInteraction: true
    });
}

function time_on_the_hour(now) {
    const hh = now.getHours();
    const now_s = now.toLocaleTimeString();

    if (hh > HHB && hh < HHE) {
        if (now_s.includes("00:00")) {
            let remainder = HHE - hh;
            if (MM == 30) {
                remainder -= 1;
            }

            MessageBox("下班倒计时", `ヾ(◍°∇°◍)ﾉﾞ 坚持住，还有 ${remainder} 小时就下班了！`);
        }
    }

    if (now_s == `${work.begin}:00`) {
        MessageBox("公主请上班", "牛会哞，马会叫，牛马会收到！！！");
    }

    if (now_s == `${work.lunch}:00`) {
        MessageBox("公主请吃饭", "人是铁，饭是钢，一顿不吃饿得慌。");
    }

    if (now_s == `${work.end}:00`) {
        MessageBox("公主请下班", "来日纵是千千阕歌，飘于远方我路上~~~");
    }
}

function main() {
    chrome.storage.local.get(["work_time"], work_time => {
        if (work_time) {
            chrome.storage.local.set({ "work_time": work });
        }
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
        work = changes["work_time"].newValue;
        HHE = new Date(`2025-06-16T${work.end}:00`).getHours();
        HHB = new Date(`2025-06-16T${work.begin}:00`).getHours();
        MM = new Date(`2025-06-16T${work.end}:00`).getMinutes();
        if (MM == 30) {
            HHE += 1;
        }
    });

    chrome.runtime.onInstalled.addListener(() => {
        chrome.alarms.create('oneSecondTimer', { periodInMinutes: 1 / 60 });
    });

    chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === 'oneSecondTimer') {
            const now = new Date();
            time_on_the_hour(now);
        }
    });
}

main();
