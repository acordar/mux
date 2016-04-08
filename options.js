// Saves options to chrome.storage
function save_options() {
  var pageViewMode = document.getElementById('pageViewMode').value;
  var fitMode = document.getElementById('fitMode').value;
  chrome.storage.sync.set({
    pageViewMode: pageViewMode,
    fitMode: fitMode
  }, function() {
    // Update status to let user know options were saved.
    alert('options saved');
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    pageViewMode: 1,
    fitMode: 1
  }, function(items) {
    document.getElementById('pageViewMode').value = items.pageViewMode
    document.getElementById('fitMode').value = items.fitMode;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);