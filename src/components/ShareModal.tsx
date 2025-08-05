import React, { useState } from 'react';
import { copyToClipboard, shareViaWebAPI, getShareUrls } from '../utils/shareUtils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareText: string;
  gameTitle: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareText, gameTitle }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  if (!isOpen) return null;

  const handleCopyToClipboard = async () => {
    const success = await copyToClipboard(shareText);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleWebShare = async () => {
    setIsSharing(true);
    const success = await shareViaWebAPI(shareText, gameTitle);
    if (!success) {
      // Fallback to copy if Web Share API not available
      await handleCopyToClipboard();
    }
    setIsSharing(false);
  };

  const shareUrls = getShareUrls(shareText, gameTitle);

  const handlePlatformShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Share Your Result</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Share Preview */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 font-mono text-sm whitespace-pre-line border">
          {shareText}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Copy to Clipboard */}
          <button
            onClick={handleCopyToClipboard}
            className={`w-full p-3 rounded-lg font-semibold transition-colors ${
              copySuccess 
                ? 'bg-green-500 text-white' 
                : 'bg-bollywood-teal text-white hover:bg-gray-500'
            }`}
          >
            {copySuccess ? '✅ Copied!' : '📋 Copy to Clipboard'}
          </button>

          {/* Web Share API (if available) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleWebShare}
              disabled={isSharing}
              className="w-full p-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
            >
              {isSharing ? 'Sharing...' : '📤 Share'}
            </button>
          )}

          {/* Platform Buttons */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3 text-center">Or share directly:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handlePlatformShare(shareUrls.whatsapp)}
                className="p-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center justify-center gap-1"
              >
                <img 
                  src="/images/icons/WhatsApp.svg" 
                  alt="WhatsApp" 
                  className="w-4 h-4 filter brightness-0 invert"
                />
                WhatsApp
              </button>
              <button
                onClick={() => handlePlatformShare(shareUrls.twitter)}
                className="p-2 bg-blue-400 text-white rounded text-sm hover:bg-blue-500"
              >
                🐦 Twitter
              </button>
              <button
                onClick={() => handlePlatformShare(shareUrls.telegram)}
                className="p-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                ✈️ Telegram
              </button>
              <button
                onClick={() => handlePlatformShare(shareUrls.facebook)}
                className="p-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                👥 Facebook
              </button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 p-2 text-gray-600 hover:text-gray-800 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
