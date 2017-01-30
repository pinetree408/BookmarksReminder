function popupOpen(bookmark) {
  var winWidth = 400;
  var winHeight = 400;
  var winURL = "../templates/bookmarks.html";
  var winName = "";
  var winPosLeft = (screen.width - winWidth) / 2;
  var winPosTop = (screen.height - winHeight) / 2;
  var winOpt = "width="+winWidth+",height="+winHeight+",top="+winPosTop+",left="+winPosLeft;
  var popUp = window.open(winURL, winName, winOpt + ",menubar=no,status=no,scrollbars=no,resizable=no");
  var date = new Date(bookmark["added"]);
  popUp.window.onload = function() {
    popUp.document.getElementById("title").innerHTML = bookmark["title"];
    popUp.document.getElementById("url").href = bookmark["url"];
    popUp.document.getElementById("dateAdded").innerHTML = date.toString();
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

chrome.bookmarks.onCreated.addListener(function(id, bookmark) {
  if (!bookmark.children) {
    var bookmarkObject = {};
    bookmarkObject['url'] = bookmark.url;
    bookmarkObject['title'] = bookmark.title;
    bookmarkObject['added'] = bookmark.dateAdded;
    chrome.storage.local.get("bookmarkList", function(result){
      var obj = {};
      obj["bookmarkList"] = result["bookmarkList"];
      obj["bookmarkList"].push(bookmarkObject);
      chrome.storage.local.set(obj);
    });
  }
});

chrome.bookmarks.onRemoved.addListener(function(id, removeInfo) {
  chrome.storage.local.get("bookmarkList", function(result){
    var obj = {};
    obj["bookmarkList"] = [];
    for (var i = 0; i < result["bookmarkList"].length; i++) {
      if (removeInfo.node.title != result["bookmarkList"][i].title) {
        obj["bookmarkList"].push(result["bookmarkList"][i]);
      }
    }
    chrome.storage.local.set(obj);
  });
});
