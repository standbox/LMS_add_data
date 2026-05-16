// 汎用 fetch + HTML パース
export async function fetchHTML(url) {
    console.log(url,'のHTMLを抽出中');
  const res = await fetch(url, { credentials: "include" });
  const text = await res.text();
  return new DOMParser().parseFromString(text, "text/html");
}

// シラバスページから担当教員・教室を抽出
export function parseSyllabus(doc) {
    console.log('シラバスから担当教員・教室を抽出する関数を実行中');
  const teacher = doc.querySelector(".c-dl-2col__item:nth-child(2) > dd")?.textContent.trim();
  const room = doc.querySelector(".c-dl-2col__item:nth-child(5) > dd")?.textContent.trim();

  return {
    teacher: teacher ?? "（教員不明）",
    room: room ?? "（教室不明）"
  };
}