class Reminder {
    constructor(timeString) {
        let args = timeString.split(":");

        this.timeString = timeString;
        this.hour = Number(args[0]);
        this.minute = Number(args[1]);
    }
};

let working = {
    morning: new Reminder("09:00"),
    noon: new Reminder("12:00"),
    afternoon: new Reminder("18:00")
};

function showNotification(title, message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: "./image/app.png",
        title: title,
        message: message,
        requireInteraction: true
    });
}

function showPopup(title, message) {
    const params = new URLSearchParams({ title, message });
    const url = chrome.runtime.getURL(`notification.html?${params}`);

    chrome.system.display.getInfo(displays => {
        const display = displays[0];
        const width = 360;
        const height = 240;
        const left = Math.round(display.workArea.left + (display.workArea.width - width) / 2);
        const top = Math.round(display.workArea.top + (display.workArea.height - height) / 2);

        chrome.windows.create({
            url,
            type: "popup",
            width,
            height,
            left,
            top,
            focused: true
        }, win => {
            chrome.windows.update(win.id, { focused: true, drawAttention: true });
        });
    });
}

function MessageBox(title, message) {
    showNotification(title, message);
    showPopup(title, message);
}

function schedule(now) {
    const hour = now.getHours();
    const timeString = now.toLocaleTimeString();

    if (timeString.includes(":00:00")) {
        let deadline = working.afternoon.hour - hour;
        if (working.afternoon.minute == 30) {
            deadline += 0.5;
        }

        if (hour > working.morning.hour && deadline > 0) {
            MessageBox("下班倒计时", `ヾ(◍°∇°◍)ﾉﾞ 坚持住，还有 ${deadline} 小时就下班了！`);
        }
    }

    if (timeString == `${working.morning.timeString}:00`) {
        MessageBox("公主请上班", "牛会哞，马会叫，牛马会收到！！！");
    }

    if (timeString == `${working.noon.timeString}:00`) {
        MessageBox("公主请吃饭", "人是铁，饭是钢，一顿不吃饿得慌。");
    }

    if (timeString == `${working.afternoon.timeString}:00`) {
        MessageBox("公主请下班", "真厉害，又上了一天班(ง •_•)ง");
    }
}

function main() {
    chrome.storage.local.get(["working"], value => {
        if (value && value.working) {
            working = value.working;
        } else {
            chrome.storage.local.set({"working": working});
        }
    });

    chrome.runtime.onInstalled.addListener(() => {
        chrome.alarms.create('oneSecondTimer', { periodInMinutes: 1 / 60 });
    });

    chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === 'oneSecondTimer') {
            schedule(new Date());
        }
    });

    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === "test") {
            MessageBox("弹窗测试", "这是一条来自 Cinderella 插件的通知。");
            return;
        }

        if (message.type === "save") {
            for (let i in message.data) {
                working[i] = new Reminder(message.data[i]);
            }

            chrome.storage.local.set({"working": working});
        }
    });
}

main();
