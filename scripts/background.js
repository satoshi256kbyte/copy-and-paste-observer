let data = {};

function loadData() {
  chrome.storage.local.get("copy-and-paste-observer", (result) => {
    debugLog("load start");
    if (Object.keys(result).length === 0 && result.constructor === Object) {
      data = {
        alert_message:
          "お忙しいところすみません。\nペーストしたテキストに気になるキーワードがあります。\n念の為確認してください。\n<キーワード>\n",
        settings: [],
      };
    } else {
      data = JSON.parse(result["copy-and-paste-observer"]);
    }
    debugLog(data);
    debugLog("load end");
  });
}
loadData();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }
  if (typeof changes["copy-and-paste-observer"] === "undefined") {
    return;
  }
  data = JSON.parse(changes["copy-and-paste-observer"].newValue);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  debugLog("action = " + request.action);
  if (request.action !== "checkContent") {
    return;
  }
  debugLog("content = " + request.content);
  debugLog(data);

  if (data.settings.length <= 0) {
    sendResponse({ message: "", includes: [] });
    return;
  }

  const url = sender.tab.url;
  debugLog("tab_url:" + url);
  let includes = [];
  for (let setting of data.settings) {
    if (!url.includes(setting.target_url)) {
      continue;
    }
    debugLog("target_url:" + setting.target_url);
    for (let keyword of setting.attention_keywords) {
      debugLog("Keyword:" + keyword);
      if (request.content.includes(keyword)) {
        debugLog("check NG!");
        includes.push(keyword);
      }
      if (includes.length == 3) {
        break;
      }
    }
  }

  sendResponse({ message: data.alert_message, includes: includes });
});

debugLog = (message) => {
  chrome.management.getSelf((info) => {
    if (info.installType === "development") {
      console.log(message);
    }
  });
};
