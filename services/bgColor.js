$(document).ready(() => {
  $("#bgColorBtn").on("click", () => {
    const userColor = prompt("Enter a background color (e.g. #AABBCC):", "#");
    if (userColor) {
      const trimmed = userColor.trim();
      const isValid = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed);
      if (isValid) {
        $("body").css("background-color", trimmed);
      } else {
        alert("Invalid color format. Please use #RRGGBB.");
      }
    }
  });
});
