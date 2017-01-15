(function () {
  'use strict';

  function checkAlarm(callback) {
    chrome.storage.local.get("bookmark", function(result) {
      chrome.alarms.getAll(function(alarms) {
        var hasAlarm = alarms.some(function(a) {
          return a.name == result["bookmark"]["title"];
        });
        var newLabel;
        if (hasAlarm) {
          newLabel = 'Cancel alarm';
        } else {
          newLabel = 'Activate alarm';
        }
        document.getElementById('toggleAlarm').innerText = newLabel;
        if (callback) {
          callback(hasAlarm);
        }
      });
    });
  }

  function createAlarm() {
    dumpBookmarks(function(result){
      var randomIndex = Math.floor(Math.random() * result.length);
      var bookmarkObj = result[randomIndex];
      chrome.alarms.create(bookmarkObj["title"], {
        delayInMinutes: 0.1, periodInMinutes: 0.3});

      var obj = {};
      obj["bookmark"] = bookmarkObj
      chrome.storage.local.set(obj);
    });
  }

  function cancelAlarm() {
    chrome.storage.local.get("bookmark",function(result) { 
      chrome.alarms.clear(result["bookmark"]["title"]);
    });
  }

  function doToggleAlarm() {
    checkAlarm( function(hasAlarm) {
      if (hasAlarm) {
        cancelAlarm();
      } else {
        createAlarm();
      }
      checkAlarm();
    });
  }

  document.getElementById('toggleAlarm').addEventListener('click', doToggleAlarm);
  checkAlarm();
})();
