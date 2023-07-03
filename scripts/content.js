document.addEventListener("paste", async (event) => {
  console.log("tese");
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData("Text");

  const response = await new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { action: "checkContent", content: pastedData },
      (response) => resolve(response)
    );
  });

  if (response.includes.length > 0) {
    window.alert(response.message + " ・" + response.includes.join("\n ・"));
  }
});
