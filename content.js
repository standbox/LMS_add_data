(async function() {

  // 1. 時間割ページのすべての授業リンクを集める
  const classLinks = document.querySelectorAll(
    "#tttimetablecontentcollapse > div > table > tbody > tr > td > a"
  );

  for (const a of classLinks) {
    try {
      // 2. 授業詳細ページを取得
      const classPage = await fetchHTML(a.href);

      // 3. 授業詳細ページから「シラバス Activity」リンクを探す
      const syllabusActivityURL = findSyllabusActivity(classPage);
      if (!syllabusActivityURL) continue;

      // 4. シラバス Activity ページを取得
      const syllabusActivityPage = await fetchHTML(syllabusActivityURL);

      // 5. 最終シラバスページへのリンクを探す
      const syllabusFinalURL = findSyllabusFinal(syllabusActivityPage);
      if (!syllabusFinalURL) continue;

      // 6. 最終シラバスページ取得
      const syllabusFinalPage = await fetchHTML(syllabusFinalURL);

      // 7. シラバスページから担当教員と教室を抽出
      const info = parseSyllabus(syllabusFinalPage);

      // 8. 時間割の該当セルに情報を書き込む
      insertInfo(a.parentElement, info);

    } catch (e) {
      console.error("LMS scraping error:", e);
    }
  }

})();