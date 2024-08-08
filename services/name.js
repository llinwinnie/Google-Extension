
$(function() {
    // chrome.storage.local.get(["name"], (data) => {
    //     changeHeader(data.name);
    // })

    $("#name input").on("keypress",(event) => {
        if (event.which == 13) {
            const name = event.currentTarget.value;
            console.log(name);
            changeHeader(name); 
            
            // chrome.storage.local.set({ name : name })
        }
    })

    function changeHeader(name) {
        $("#name div.control").remove();
        $("#name").append(`<h1 class="title">${name}</h1>`)
 }
});