//if we want to change the background every tab
// (() => {
//   fetch(
//     "https://pixabay.com/api/?key=45304787-32c35c1321ee012d846c080c9&image_type=illustration&editors_choice=true&color=black",
//     {
//       method: "GET",
//     }).then((res) => res.json())
//         .then((image) => {
//           console.log(image);
//           const img = image.hits[Math.floor(Math.random()*20)].largeImageURL;
//           const bg = document.querySelector(".mainbg");
//           bg.style.backgroundImage = `url(${img})`;
//       });

// })();

bg.style.backgroundImage = "bg.jpg"

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && tab.url === 'chrome://newtab/') {
//     chrome.action.setIcon({ tabId: tabId, path: 'icon.png' });
//   }
// });
