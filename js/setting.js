function addSetting() {
  var setting = document.getElementById("setting-value").value;
  var obj = {};
  obj["setting"] = setting
  chrome.storage.local.set(obj);
}
chrome.storage.local.get("setting", function(result) {
  var setting = 60;
  if (result["setting"]) {
    setting = result["setting"];
  }
  document.getElementById("setting-value").value = setting; 
});
document.getElementById("setting").addEventListener("click", addSetting);
