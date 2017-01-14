(function () {
  'use strict';

  function checkAlarm(callback) {
    chrome.storage.local.get('alarmName', function(result) {
      chrome.alarms.getAll(function(alarms) {
        var hasAlarm = alarms.some(function(a) {
          return a.name == result['alarmName'];
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
      var alarmName = result[randomIndex]['title'];
      chrome.alarms.create(alarmName, {
        delayInMinutes: 0.1, periodInMinutes: 0.3});

      var obj = {};
      obj['alarmName'] = alarmName
      chrome.storage.local.set(obj);
    });
  }

  function cancelAlarm() {
    chrome.storage.local.get('alarmName',function(result) { 
      chrome.alarms.clear(result['alarmName']);
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
