$(document).ready(() => {
  const display = $("#calcDisplay");
  let currentInput = "";

  $(".calculator-buttons button").on("click", function () {
    const val = $(this).data("value");
    const action = $(this).data("action");

    if (action === "clear") {
      currentInput = "";
      display.val("");
      return;
    }

    if (val === "=") {
      try {
        const expr = currentInput
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/−/g, "-");
        let result = eval(expr);
        if (typeof result === "number") {
          result = Math.round((result + Number.EPSILON) * 100000) / 100000;
        }
        display.val(result);
        currentInput = result.toString();
      } catch (err) {
        display.val("Error");
        currentInput = "";
      }
      return;
    }

    currentInput += val;
    display.val(currentInput);
  });
});
