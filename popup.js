document.addEventListener('DOMContentLoaded', function() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const statusDiv = document.getElementById('status');

  function showStatus(message, isSuccess = true) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${isSuccess ? 'success' : 'error'}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }

  analyzeBtn.addEventListener('click', function() {
    // Get the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const activeTab = tabs[0];
      
      // Check if we're on a supported email site
      if (!activeTab.url.includes('mail.google.com') && 
          !activeTab.url.includes('outlook.live.com') && 
          !activeTab.url.includes('outlook.office.com')) {
        showStatus('Please navigate to Gmail or Outlook to use this extension.', false);
        return;
      }

      // Send message to content script
      chrome.tabs.sendMessage(activeTab.id, {
        action: 'analyzeCurrentEmail'
      }, function(response) {
        if (chrome.runtime.lastError) {
          showStatus('Error: Please refresh the page and try again.', false);
        } else {
          showStatus('Email analysis completed! Check for warnings in the email.');
        }
      });
    });
  });

  // Show current tab URL for debugging (can be removed in production)
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentUrl = tabs[0].url;
    console.log('Current URL:', currentUrl);
  });
});
