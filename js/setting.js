function addSetting() {
  var setting = document.getElementById("setting-value").value;
  var obj = {};
  obj["setting"] = setting
  chrome.storage.local.set(obj);
}
document.getElementById("setting").addEventListener("click", addSetting);
