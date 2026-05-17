// content.js からのメッセージを待機
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchSyllabus") {
    // 代わりに fetch を実行
    fetch(request.url)
      .then(response => response.text())
      .then(text => {
        sendResponse({ data: text });
      })
      .catch(error => {
        sendResponse({ error: error.message });
      });
    return true; // 非同期でレスポンスを返すために必要
  }
});