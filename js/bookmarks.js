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
    var bookmarkObject = {};
    bookmarkObject['url'] = bookmarkNode.url;
    bookmarkObject['title'] = bookmarkNode.title;
    list.push(bookmarkObject);
  }
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    dumpTreeNodes(bookmarkNode.children, list);
  }
}
chrome.storage.local.get("bookmarkList", function(result) {
  if (!result["bookmarkList"]) {
    dumpBookmarks(
      function(result) {
        var obj = {};
        obj["bookmarkList"] = result;
        chrome.storage.local.set(obj);
      }
    );
  }
});
