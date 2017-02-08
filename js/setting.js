function addSetting() {
  var setting = document.getElementById("setting-value").value;
  if ((setting != "") && (14 < Number(setting)) && (Number(setting) < 121)) {
    var obj = {};
    obj["setting"] = setting
    chrome.storage.local.set(obj);
    document.getElementById("setting-value-view").innerHTML = setting;
  }
  if ((setting == "") || (Number(setting) < 15) || (Number(setting) > 120)) {
    document.getElementById("setting-input").classList.add("is-invalid");
  }
  if (document.getElementById("setting-input").classList.contains("is-invalid") == false) {
    document.getElementById("setting-value").value = "";
    document.getElementById("setting-input").classList.remove("is-dirty");
  }
}
chrome.storage.local.get("setting", function(result) {
  var setting = 60;
  if (debug == true) {
    setting = 1;
  }
  if (result["setting"]) {
    setting = result["setting"];
  }
  document.getElementById("setting-value-view").innerHTML = setting;
});
document.getElementById("setting").addEventListener("click", addSetting);
