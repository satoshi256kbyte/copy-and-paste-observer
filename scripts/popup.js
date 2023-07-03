document.addEventListener("DOMContentLoaded", () => {
  const settingsArea = document.getElementById("settings");
  const saveButton = document.getElementById("save-button");
  const cancelButton = document.getElementById("cancel-button");

  // 設定をロード
  chrome.storage.local.get("copy-and-paste-observer", (result) => {
    data = {
      alert_message:
        "お忙しいところすみません。\nペーストしたテキストに気になるキーワードがあります。\n念の為確認してください。\n\n",
      settings: [
        {
          target_url: "exmple.com",
          attention_keywords: ["キーワード1", "キーワード2", "キーワード3"],
        },
      ],
    };
    if (Object.keys(result).length > 0 || result.constructor !== Object) {
      data = result["copy-and-paste-observer"];
    }

    settingsArea.value = data;
  });

  // 保存ボタンがクリックされたときの処理
  saveButton.addEventListener("click", () => {
    chrome.storage.local.set(
      { "copy-and-paste-observer": settingsArea.value },
      () => {
        window.alert("設定が保存されました。");
        window.close();
      }
    );
  });

  // キャンセルボタンがクリックされたときの処理
  cancelButton.addEventListener("click", () => {
    window.close();
  });
});
