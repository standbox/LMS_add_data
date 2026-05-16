// HTMLテキストをDOMにパースして返す
async function fetchHTML(url) {
  const res = await fetch(url, { credentials: "include" });
  const text = await res.text();
  return new DOMParser().parseFromString(text, "text/html");
}


// ============================================================
// ① シラバス本体ページから担当教員と教室を抽出
//    ↓あなたの LMS 専用のセレクタを使った確定版
// ============================================================
function parseSyllabus(doc) {

  // 担当教員 ＝ .c-dl-2col__itemの 2番目 の dd
  const teacher = doc
    .querySelector(".c-dl-2col__item:nth-child(2) dd")
    ?.textContent.trim();

  // 教室 ＝ .c-dl-2col__itemの 5番目 の dd
  const room = doc
    .querySelector(".c-dl-2col__item:nth-child(5) dd")
    ?.textContent.trim();

  return {
    teacher: teacher || "（教員不明）",
    room: room || "（教室不明）",
  };
}


// ============================================================
// ② 授業詳細ページ → 「シラバス Activity」のリンクを取得
// ============================================================
function findSyllabusActivity(doc) {
  const link = doc.querySelector('[data-activityname="シラバス"] .activityname a');
  return link ? link.href : null;
}


// ============================================================
// ③ シラバス Activity ページ → 最終シラバスページ URL を取得
// ============================================================
function findSyllabusFinal(doc) {
  const link = doc.querySelector(".urlworkaround a");
  return link ? link.href : null;
}


// ============================================================
// ④ 時間割の要素に 担当教員／教室 を挿入
// ============================================================
function insertInfo(el, info) {
  const box = document.createElement("div");
  box.className = "lms-extra-info";
  box.innerHTML = `
    <div><b>担当：</b>${info.teacher}</div>
    <div><b>教室：</b>${info.room}</div>
  `;
  el.appendChild(box);
}
