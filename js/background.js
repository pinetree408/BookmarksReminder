function popupOpen(bookmark) {
  var winWidth = 400;
  var winHeight = 400;
  var winURL = "../templates/bookmarks.html";
  var winName = "";
  var winPosLeft = (screen.width - winWidth) / 2;
  var winPosTop = (screen.height - winHeight) / 2;
  var winOpt = "width="+winWidth+",height="+winHeight+",top="+winPosTop+",left="+winPosLeft;
  var popUp = window.open(winURL, winName, winOpt + ",menubar=no,status=no,scrollbars=no,resizable=no");
  popUp.window.onload = function() {
    popUp.document.getElementById("title").innerHTML = bookmark["title"];
    popUp.document.getElementById("url").href = bookmark["url"];
  }
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  chrome.storage.local.get("bookmarkList", function(result){
    var bookmarkList = result["bookmarkList"];
    var randomIndex = Math.floor(Math.random() * bookmarkList.length);
    var bookmarkObj = bookmarkList[randomIndex];
    popupOpen(bookmarkObj);
  });
});
