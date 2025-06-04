$(document).ready(() => {
  $("#quoteButton").on("click", () => {
    fetch("https://api.quotable.io/random")
      .then((res) => {
        if (!res.ok) throw new Error("Quotes fetch error");
        return res.json();
      })
      .then((data) => {
        $("#quoteButton").text(`“${data.content}” — ${data.author}`);
        $("#quoteButton").attr("disabled", true);
      })
      .catch((err) => {
        console.error("Error fetching quote:", err);
        $("#quoteButton").text("Quote unavailable");
        $("#quoteButton").attr("disabled", true);
      });
  });
});
