// 時間割ページの授業リンクを集める
const classLinks = document.querySelectorAll(
  "#tttimetablecontentcollapse > div > table > tbody >:nth-child(odd) > td a"
);
classLinks.forEach(a => {
  processClassCell(a);
});

async function processClassCell(a) {
  const td = a.closest("td");
  const cacheKey = "syllabus_" + btoa(a.href); // URLを暗号化してキーにする

  // 1. ストレージからデータを取得してみる
  const result = await chrome.storage.local.get([cacheKey]);
  
  let info;
  if (result[cacheKey]) {
    console.log('キャッシュから読み込みました');
    info = result[cacheKey];
  } else {
    console.log('キャッシュがないため新規取得します');
    // 2. 既存の通信処理（fetchHTMLなど）を実行
    const detailDoc = await fetchHTML(a.href);
    const actLink = detailDoc.querySelector('[data-activityname="シラバス"] .activityname a');
    if (!actLink) return;
    
    const actDoc = await fetchHTML(actLink.href);
    const finalLink = actDoc.querySelector(".urlworkaround a");
    if (!finalLink) return;
    
    const syllabusDoc = await fetchHTML(finalLink.href);
    info = parseSyllabus(syllabusDoc);

    // 3. 次回のために保存
    await chrome.storage.local.set({ [cacheKey]: info });
  }

  // 表示処理
  insertInfo(td, info);
}

// 追加表示を <td> の下部に挿入
function insertInfo(td, info) {
    console.log('追記しはじめた');
  const box = document.createElement("div");
  box.style.marginTop = "4px";
  box.style.fontSize = "0.8em";
  box.style.background = "#eef5ff";
  box.style.padding = "4px";
  box.style.borderRadius = "4px";

  box.innerHTML = `
    <div>${info.teacher}</div><br>
    <div>${info.room}</div>
  `;

  td.appendChild(box);
}