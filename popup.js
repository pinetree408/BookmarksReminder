// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
    });
}

function dumpTreeNodes(bookmarkNodes, query) {
  var list = $('<div>');
  var i;
  for (i = 0; i < bookmarkNodes.length; i++) {
    list.append(dumpNode(bookmarkNodes[i], query));
  }
  return list;
}

function dumpNode(bookmarkNode, query) {

  if (bookmarkNode.title) {
    if (query && !bookmarkNode.children) {
      if (String(bookmarkNode.title).indexOf(query) == -1) {
        return $('<div></div>');
      }
    }


    if (bookmarkNode.url) {
      var anchor = $('<a>');
      anchor.css({
        'float': 'left'
      });
      anchor.attr('href', bookmarkNode.url);
      anchor.text(bookmarkNode.title);
      anchor.click(function() {
        chrome.storage.local.get(bookmarkNode.title, function(result) {
          if (result[bookmarkNode.title] != undefined) {
	    var obj = {};
	    obj[bookmarkNode.title] = result[bookmarkNode.title] + 1;
            chrome.storage.local.set(obj);
	  }
        });
        chrome.tabs.create({url: bookmarkNode.url});
      });

      var readCount = $('<div>');
      readCount.css({
        'float': 'left'
      });
      chrome.storage.local.get(bookmarkNode.title, function(result) {
        if (result[bookmarkNode.title]) {
          readCount.append(result[bookmarkNode.title]);
        } else {
	  var obj = {}
	  obj[bookmarkNode.title] = 0
          chrome.storage.local.set(obj);
          readCount.append(0);
        }
      });

      var bookmarkItem = $('<div>');
      bookmarkItem.css({
        'width': '100%',
        'height': '15px'
      });
      bookmarkItem.append(anchor);
      bookmarkItem.append(readCount);
    } else {
      var bookmarkItem = $('<div>');
      bookmarkItem.text(bookmarkNode.title);
    }

  }

  var li = $('<div>').append(bookmarkItem);
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    li.append(dumpTreeNodes(bookmarkNode.children, query));
  }
  return li;
}

var alarmClock = {

  onHandler : function(e) {
    chrome.storage.local.get(null, function(items) {
      var allKeys = Object.keys(items);
      var randIndex = Math.floor(Math.random() * 100);
      bookmark = allKeys[randIndex];
      chrome.alarms.create(bookmark, {delayInMinutes: 0.1, periodInMinutes: 0.2});
    });
  },

  offHandler : function(e) {
    chrome.alarms.clearAll(function(result){
      alert("Alarms are closed");
      console.log(result);
    });
  },

  setup: function() {
    document.getElementById('alarmOn').addEventListener('click', alarmClock.onHandler);
    document.getElementById('alarmOff').addEventListener('click', alarmClock.offHandler);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarks();
  alarmClock.setup();
});
