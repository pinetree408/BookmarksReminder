/**
 * alarm.js
 * This module manages alarm logic of the extension
 */

(function () {
  'use strict';

  // alarm object's name property
  var alarmName = 'reminder';

  /**
   * checkAlarm
   * @param {function} callback
   */
  function checkAlarm(callback) {
    chrome.alarms.getAll(function(alarms) {
      var hasAlarm = alarms.some(function(a) {
        return a.name == alarmName;
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
  }

  function createAlarm() {
    chrome.storage.local.get('setting', function(result) {
      var setting = 60;
      if (debug == true) {
        setting = 1;
      }

      if (result.setting) {
	setting = result.setting;
      }

      chrome.alarms.create(alarmName, {
        delayInMinutes: Number(setting),
        periodInMinutes: Number(setting)
      });
      checkAlarm();
    });
  }

  function cancelAlarm() {
    chrome.alarms.clear(alarmName);
    checkAlarm();
  }

  function doToggleAlarm() {
    checkAlarm( function(hasAlarm) {
      if (hasAlarm) {
        cancelAlarm();
      } else {
        createAlarm();
      }
    });
  }

  document.getElementById('toggleAlarm').addEventListener('click', doToggleAlarm);
  checkAlarm();
})();
