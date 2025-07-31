// Phishing Email Analyzer Content Script
// Created by Priyam Patel
// Advanced phishing detection with enhanced algorithms

class PhishingAnalyzer {
  constructor() {
    this.phishingKeywords = [
      'verify', 'account', 'suspended', 'urgent', 'immediate action', 
      'click here', 'limited time', 'act now', 'confirm identity',
      'security alert', 'unusual activity', 'locked account',
      'update payment', 'billing problem', 'expire today',
      'congratulations', 'winner', 'prize', 'free gift',
      'tax refund', 'government', 'irs', 'social security'
    ];
    this.suspiciousDomains = [
      'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly',
      'short.link', 'tiny.cc', 'rebrand.ly', 'is.gd'
    ];
    this.legitimateDomains = [
      'google.com', 'microsoft.com', 'apple.com', 'amazon.com',
      'paypal.com', 'ebay.com', 'facebook.com', 'twitter.com'
    ];
  }

  // Analyze links in email content
  analyzeLinks(content) {
    const urlPattern = /https?:\/\/(?:[-\w.]|(?:%[\da-fA-F]{2}))+[\w\/]*/g;
    const urls = content.match(urlPattern) || [];
    const suspiciousUrls = urls.filter(url => 
      this.suspiciousDomains.some(domain => url.includes(domain))
    );
    return suspiciousUrls;
  }

  // Check for phishing keywords
  checkKeywords(content) {
    const lowerContent = content.toLowerCase();
    const foundKeywords = this.phishingKeywords.filter(keyword => 
      lowerContent.includes(keyword)
    );
    return foundKeywords;
  }

  // Calculate risk score
  calculateRiskScore(suspiciousUrls, foundKeywords) {
    let score = 0;
    score += suspiciousUrls.length * 3; // Weight suspicious URLs more heavily
    score += foundKeywords.length * 2;
    return Math.min(score, 10); // Cap at 10
  }

  // Get risk level text
  getRiskLevel(score) {
    if (score >= 7) return { level: 'HIGH', color: '#ff4444' };
    if (score >= 4) return { level: 'MEDIUM', color: '#ff8800' };
    if (score >= 1) return { level: 'LOW', color: '#ffaa00' };
    return { level: 'SAFE', color: '#44aa44' };
  }

  // Analyze email content
  analyzeEmail(emailContent) {
    const suspiciousUrls = this.analyzeLinks(emailContent);
    const foundKeywords = this.checkKeywords(emailContent);
    const riskScore = this.calculateRiskScore(suspiciousUrls, foundKeywords);
    const riskInfo = this.getRiskLevel(riskScore);

    return {
      riskScore,
      riskLevel: riskInfo.level,
      riskColor: riskInfo.color,
      suspiciousUrls,
      foundKeywords
    };
  }

  // Create warning banner
  createWarningBanner(analysis) {
    const banner = document.createElement('div');
    banner.className = 'phishing-warning-banner';
    banner.style.cssText = `
      background-color: ${analysis.riskColor};
      color: white;
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
      font-weight: bold;
      text-align: center;
      position: relative;
      z-index: 1000;
    `;

    let warningText = `⚠️ PHISHING RISK: ${analysis.riskLevel} (Score: ${analysis.riskScore}/10)`;
    if (analysis.suspiciousUrls.length > 0) {
      warningText += ` - Contains ${analysis.suspiciousUrls.length} suspicious link(s)`;
    }
    if (analysis.foundKeywords.length > 0) {
      warningText += ` - Contains ${analysis.foundKeywords.length} phishing keyword(s)`;
    }

    banner.textContent = warningText;
    return banner;
  }

  // Monitor for new emails (Gmail specific)
  monitorGmail() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          setTimeout(() => this.scanCurrentEmail(), 1000);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initial scan
    setTimeout(() => this.scanCurrentEmail(), 2000);
  }

  // Scan current email
  scanCurrentEmail() {
    // Remove existing banners
    const existingBanners = document.querySelectorAll('.phishing-warning-banner');
    existingBanners.forEach(banner => banner.remove());

    // Gmail selectors
    const emailContent = document.querySelector('[role="main"] [data-message-id]') ||
                        document.querySelector('.ii.gt .a3s.aiL') ||
                        document.querySelector('.ii.gt div[dir="ltr"]');

    if (emailContent) {
      const content = emailContent.textContent || emailContent.innerText || '';
      if (content.trim().length > 0) {
        const analysis = this.analyzeEmail(content);
        
        if (analysis.riskScore > 0) {
          const banner = this.createWarningBanner(analysis);
          
          // Try to insert banner at the top of email content
          const emailContainer = emailContent.closest('[data-message-id]') || 
                                emailContent.parentElement;
          if (emailContainer) {
            emailContainer.insertBefore(banner, emailContainer.firstChild);
          }
        }
      }
    }
  }
}

// Initialize the analyzer
const analyzer = new PhishingAnalyzer();

// Start monitoring based on the current site
if (window.location.hostname.includes('mail.google.com')) {
  analyzer.monitorGmail();
} else if (window.location.hostname.includes('outlook')) {
  // Could extend for Outlook support
  console.log('Outlook support coming soon');
}

// Listen for messages from popup
chrome.runtime.onMessage?.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeCurrentEmail') {
    analyzer.scanCurrentEmail();
    sendResponse({ status: 'analysis_started' });
  }
});
