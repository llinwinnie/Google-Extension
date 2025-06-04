$(document).ready(() => {
  $(".draggable").each(function () {
    const $panel = $(this);
    const $header = $panel.find(".panel-header");

    let offsetX = 0,
      offsetY = 0,
      isDragging = false;

    $header.css("cursor", "move");

    $header.on("mousedown", function (e) {
      isDragging = true;
      const panelOffset = $panel.offset();
      offsetX = e.pageX - panelOffset.left;
      offsetY = e.pageY - panelOffset.top;
      $("body").css("user-select", "none");
    });

    $(document).on("mousemove", function (e) {
      if (!isDragging) return;
      $panel.offset({
        top: e.pageY - offsetY,
        left: e.pageX - offsetX
      });
    });

    $(document).on("mouseup", function () {
      if (isDragging) {
        isDragging = false;
        $("body").css("user-select", "auto");
      }
    });
  });
});
