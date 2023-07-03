let data = {};

chrome.storage.local.get("copy-and-paste-observer", (result) => {
  if (Object.keys(result).length === 0 && result.constructor === Object) {
    data = {
      alert_message:
        "お忙しいところすみません。\nペーストしたテキストに気になるキーワードがあります。\n念の為確認してください。\n<キーワード>\n",
      settings: [],
    };
  } else {
    data = JSON.parse(result["copy-and-paste-observer"]);
  }
});

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
  if (request.action !== "checkContent") {
    return;
  }
  if (data.settings.length <= 0) {
    sendResponse({ message: "", includes: [] });
    return;
  }

  const url = sender.tab.url;
  console.log("tab_url:", url);
  let includes = [];
  for (let setting of data.settings) {
    console.log("target_url:", setting.target_url);
    if (!url.includes(setting.target_url)) {
      continue;
    }
    for (let keyword of setting.attention_keywords) {
      console.log("Keyword:", keyword);
      if (request.content.includes(keyword)) {
        includes.push(keyword);
      }
      if (includes.length == 3) {
        break;
      }
    }
  }

  sendResponse({ message: data.alert_message, includes: includes });
});
