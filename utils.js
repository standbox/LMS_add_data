// HTMLテキストをDOMにパースして返す
async function fetchHTML(url) {
  const res = await fetch(url, { credentials: "include" });
  const text = await res.text();
  return new DOMParser().parseFromString(text, "text/html");
}

// シラバスページから担当教員・教室を抽出
// ※ LMS の実際の DOM に合わせて書き換えてください
function parseSyllabus(doc) {
  // 例:
  const teacher = doc.querySelector(".teacher, .instructor, #teacher")?.textContent.trim();
  const room = doc.querySelector(".room, .classroom, #room")?.textContent.trim();

  return {
    teacher: teacher ?? "（教員不明）",
    room: room ?? "（教室不明）"
  };
}

// 授業ページからシラバスリンクを探す
function findSyllabusLink(doc) {
  const link = doc.querySelector('a[href*="syllabus"], a:contains("シラバス")');
  return link ? link.href : null;
}

// 情報を時間割DOMに挿入
function insertInfo(el, info) {
  const box = document.createElement("div");
  box.className = "lms-extra-info";
  box.innerHTML = `
    <div><b>担当：</b>${info.teacher}</div>
    <div><b>教室：</b>${info.room}</div>
  `;
  el.appendChild(box);
}
