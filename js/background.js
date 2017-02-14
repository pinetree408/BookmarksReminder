function popupOpen(bookmark) {
  var winWidth = 450;
  var winHeight = 450;
  var winPosLeft = (screen.width - winWidth) / 2;
  var winPosTop = (screen.height - winHeight) / 2;

  var winOpt = 'width='+winWidth+',height='+winHeight+',top='+winPosTop+',left='+winPosLeft;
  var winURL = '../templates/bookmarks.html';
  var winName = '';

  var popUp = window.open(winURL, winName, winOpt + ',menubar=no,status=no,scrollbars=no,resizable=no');

  popUp.window.onload = function() {
    popUp.document.getElementById('title').innerHTML = bookmark.title;
    popUp.document.getElementById('urlActivate').href = bookmark.url;

    var date = new Date(bookmark.added);
    popUp.document.getElementById('dateAdded').innerHTML = date.toString();

    chrome.bookmarks.get(bookmark.parentId, function(results) {
      popUp.document.getElementById('parent').innerHTML = results[0].title;
    });
  }

  popUp.window.onbeforeunload = function() {
    chrome.storage.local.get('isAlarmClosed', function(result){
      if (result.isAlarmClosed == false){
        chrome.storage.local.set({isAlarmClosed: true});
      }
    });
  }
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  chrome.storage.local.get('isAlarmClosed', function(result) {
    if((result.isAlarmClosed == undefined) || (result.isAlarmClosed == true)) {
      chrome.storage.local.set({isAlarmClosed: false});
      chrome.storage.local.get('bookmarkList', function(result){
        var bookmarkList = result.bookmarkList;
        var randomIndex = Math.floor(Math.random() * bookmarkList.length);
        var bookmarkObj = bookmarkList[randomIndex];
        popupOpen(bookmarkObj);
      });
    }
  });
});

chrome.bookmarks.onCreated.addListener(function(id, bookmark) {
  if (!bookmark.children) {
    var bookmarkObject = {
      url: bookmark.url,
      title: bookmark.title,
      added: bookmark.dateAdded,
      parentId: bookmark.parentId
    };
    chrome.storage.local.get('bookmarkList', function(result){
      var obj = {
        bookmarkList: result.bookmarkList
      };
      obj.bookmarkList.push(bookmarkObject);
      chrome.storage.local.set(obj);
    });
  }
});

chrome.bookmarks.onRemoved.addListener(function(id, removeInfo) {
  chrome.storage.local.get('bookmarkList', function(result){
    var removedBookmarkList = result.bookmarkList.filter(function(bookmark) {
      return removeInfo.node.title != bookmark.title;
    });
    chrome.storage.local.set({bookmarkList: removedBookmarkList});
  });
});
