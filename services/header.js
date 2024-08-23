
$(function() {
    chrome.storage.local.get(["header"], (data) => {
        if (data.header)
            changeHeader(data.header);
    });

    $("#header").on("click", "h1.title", function() {
        const currentHeader = $(header).text();
        $(this).replaceWith(`<input type="text" class="edit-header" value="${currentHeader}">`);
        $(".edit-header").focus();
    });

    $("#header input").keypress((event) => {
        if (event.which == 13) {
            const header = event.currentTarget.value;
            changeHeader(header);
            chrome.storage.local.set({ header: header })
        }
    })
    function changeHeader(header) {
        $("#header div.control").remove();
        $("#header").append(`<h1 class="title"> ${header}!</h1>`);
    }
})