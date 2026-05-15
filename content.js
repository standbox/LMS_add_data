//test
console.log("LMS Timetable Enhancer loaded.");

// 時間割ページ内で授業要素を取得するセレクタ
// ※あなたのLMSに合わせて修正
const COURSE_SELECTOR = ".course-item, .timetable-course, .course";

/**
 * 特定の授業セルを拡張する
 */
async function enhanceCourseElement(el) {
  const courseLink = el.querySelector("a")?.href;
  if (!courseLink) return;

  // キャッシュ確認
  const cached = await chrome.storage.local.get(courseLink);
  if (cached[courseLink]) {
    insertInfo(el, cached[courseLink]);
    return;
  }

  try {
    // 授業ページ取得
    const courseDoc = await fetchHTML(courseLink);

    // シラバスリンクを発見
    const syllabusLink = findSyllabusLink(courseDoc);
    if (!syllabusLink) return;

    // シラバスページ取得
    const syllabusDoc = await fetchHTML(syllabusLink);

    // 教員情報抽出
    const info = parseSyllabus(syllabusDoc);

    // DOM に追加
    insertInfo(el, info);

    // キャッシュ保存
    await chrome.storage.local.set({ [courseLink]: info });
  } catch (e) {
    console.error("Failed to enhance course:", e);
  }
}

/**
 * ページ内のすべての授業セルに適用する
 */
function enhanceAll() {
  const courseElements = document.querySelectorAll(COURSE_SELECTOR);
  courseElements.forEach(el => {
    if (!el.dataset.enhanced) {
      el.dataset.enhanced = "1";
      enhanceCourseElement(el);
    }
  });
}

// 初期実行
enhanceAll();

// SPA対応：ページ更新を監視
const observer = new MutationObserver(() => {
  enhanceAll();
});
observer.observe(document.body, { childList: true, subtree: true });