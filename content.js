
// 時間割ページの授業リンクを集める
const classLinks = document.querySelectorAll(
  "#tttimetablecontentcollapse > div > table > tbody > tr > td > a"
);
console.log('content.js起動中');
classLinks.forEach(a => {
  processClassCell(a);
});

async function processClassCell(a) {
  // セル <td> を取得（後で追記するため）
  console.log('processClassCellし始めた(アクセスから追加までの関数)');
  const td = a.closest("td");

  // ① 授業詳細ページを取る
  const detailDoc = await fetchHTML(a.href);

  // ② シラバスアクティビティへのリンクを探す
  const actLink = detailDoc.querySelector('[data-activityname="シラバス"] .activityname a');
  if (!actLink) return;
  console.log('シラバスアクティビティへのリンクを見つけられた');
  const actDoc = await fetchHTML(actLink.href);

  // ③ シラバス本体ページへのリンク（.urlworkaround a）
  const finalLink = actDoc.querySelector(".urlworkaround a");
  if (!finalLink) return;

  const syllabusDoc = await fetchHTML(finalLink.href);

  // ④ 担当教員・教室を抽出
  const info = parseSyllabus(syllabusDoc);

  // ⑤ TD の下に追記
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
    <div><b>担当：</b>${info.teacher}</div>
    <div><b>教室：</b>${info.room}</div>
  `;

  td.appendChild(box);
}