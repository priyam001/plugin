# Phishing Email Analyzer Extension

## Overview
This Chrome extension scans emails for phishing indicators like suspicious URLs and phishing keywords. It provides a risk score and warning banner directly in supported email providers such as Gmail and Outlook online.

## Features
- **Automatic email scanning** for phishing indicators
- **Risk scoring system** based on suspicious links and keywords
- **Warning banner** displayed directly in email view
- **Supports Gmail and Outlook Online**

## Installation
1. **Open Chrome** and go to `chrome://extensions/`
2. **Enable Developer mode** (toggle in the top-right corner)
3. **Click "Load unpacked"**
4. **Select the folder**: `C:\Users\priya\downloads\shared\Null\chrome-extension`

## Usage
1. Navigate to an email in Gmail or Outlook
2. Open the email
3. Click the extension icon in Chrome's toolbar
4. Click "Analyze Current Email"
5. The extension examines the email and displays warnings if phishing indicators are detected

## Files Included
- **manifest.json**: Configuration file for the Chrome extension
- **content.js**: Script that runs on email sites to analyze email content
- **popup.html**: HTML for the extension's popup interface
- **popup.js**: JavaScript for the popup interface
- **styles.css**: Styling for the extension's UI

## Troubleshooting
If the extension fails to load, ensure all files are in the correct directory and that there are no syntax errors in the `manifest.json` file.

## Contribution
Feel free to fork the repository and submit pull requests. Feedback and enhancements are welcome!
