// 汎用 fetch + HTML パース
async function fetchHTML(url) {
  console.log(url, 'のHTMLを抽出依頼中（via background）');
  
  // background.js に「取ってきて！」とメッセージを送る
  const response = await chrome.runtime.sendMessage({
    action: "fetchSyllabus",
    url: url
  });

  if (response.error) {
    throw new Error(response.error);
  }

  // 文字列で返ってきたHTMLを解析してDocumentオブジェクトにする
  return new DOMParser().parseFromString(response.data, "text/html");
}

// シラバスページから担当教員・教室を抽出
function parseSyllabus(doc) {
    console.log('シラバスから担当教員・教室を抽出する関数を実行中');
  const teacher = doc.querySelector(".c-dl-2col__item:nth-child(2) > dd")?.textContent.trim();
  const room = doc.querySelector(".c-dl-2col__item:nth-child(5) > dd")?.textContent.trim();

  return {
    teacher: teacher ?? "（教員不明）",
    room: room ?? "（教室不明）"
  };
}