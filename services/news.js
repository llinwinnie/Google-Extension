$(document).ready(() => {
  $("#newsButton").on("click", () => {
    const RSS_URL = "https://feeds.bbci.co.uk/news/technology/rss.xml";

    fetch(RSS_URL)
      .then((res) => {
        if (!res.ok) throw new Error("RSS fetch error");
        return res.text();
      })
      .then((xmlStr) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlStr, "application/xml");
        const items = Array.from(xmlDoc.querySelectorAll("item"));
        if (items.length === 0) throw new Error("No RSS items found");

        const randomIndex = Math.floor(Math.random() * items.length);
        const chosen = items[randomIndex];
        const titleTag = chosen.querySelector("title");
        const linkTag = chosen.querySelector("link");
        const descTag = chosen.querySelector("description");

        const title = titleTag ? titleTag.textContent : "No title";
        const link = linkTag ? linkTag.textContent : "#";
        const description = descTag ? descTag.textContent : "";

        $("#newsButton").html(`
          <strong><a href="${link}" target="_blank" style="color:#5D4037;">
            ${title}
          </a></strong><br>${description}
        `);
        $("#newsButton").attr("disabled", true);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        $("#newsButton").text("News unavailable");
        $("#newsButton").attr("disabled", true);
      });
  });
});
