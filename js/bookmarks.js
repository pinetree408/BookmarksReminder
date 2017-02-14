function dumpBookmarks(callBack) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      var list = [];
      dumpTreeNodes(bookmarkTreeNodes, list);
      callBack(list);
    });
}

function dumpTreeNodes(bookmarkNodes, list) {
  var i;
  for (i = 0; i < bookmarkNodes.length; i++) {
    dumpNode(bookmarkNodes[i], list);
  }
}

function dumpNode(bookmarkNode, list) {
  if (!bookmarkNode.children) {
    var bookmarkObject = {
      url: bookmarkNode.url,
      title: bookmarkNode.title,
      added: bookmarkNode.dateAdded,
      parentId: bookmarkNode.parentId
    };
    list.push(bookmarkObject);
  }
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    dumpTreeNodes(bookmarkNode.children, list);
  }
}

chrome.storage.local.get('bookmarkList', function(result) {
  if (!result.bookmarkList) {
    dumpBookmarks(
      function(result) {
        chrome.storage.local.set({bookmarkList: result});
        document.getElementById('bookmarksNum').innerText = result.length;
      }
    );
  } else {
    document.getElementById('bookmarksNum').innerText = result.bookmarkList.length;
  }
});
