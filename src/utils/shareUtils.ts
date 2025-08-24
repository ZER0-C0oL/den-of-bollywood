import { SHARE_CONFIG } from '../constants/gameConfig';

// Types for share data
export interface FaceMashShareData {
  gameId: string;
  gameWon: boolean;
  totalAttempts: number;
  maxAttempts: number;
  actor1Found: boolean;
  actor2Found: boolean;
  actor1Attempts: number;
  actor2Attempts: number;
}

export interface ConnectionsShareData {
  gameId: string;
  gameWon: boolean;
  totalAttempts: number;
  maxAttempts: number;
  solvedGroups: string[];
  attemptResults: ('correct' | 'one_away' | 'wrong')[];
}

export interface PlotFusionShareData {
  gameId: string;
  gameWon: boolean;
  totalAttempts: number;
  maxAttempts: number;
  movie1Found: boolean;
  movie2Found: boolean;
  movie1Attempts: number;
  movie2Attempts: number;
}

export interface GlimpsedShareData {
  gameId: string;
  gameWon: boolean;
  totalAttempts: number;
  framesShown: number;
  guesses: string[];
}

/**
 * Generate share text for Face Mash game
 */
export const generateFaceMashShareText = (data: FaceMashShareData): string => {
  const gameNumber = SHARE_CONFIG.getGameNumber(data.gameId);
  const { WRONG_ATTEMPT, SUCCESS } = SHARE_CONFIG.COLORS.FACE_MASH;
  
  // Generate progress for Actor A
  const actorAProgress = generateActorProgress(data.actor1Attempts, data.actor1Found, WRONG_ATTEMPT, SUCCESS);
  
  // Generate progress for Actor B  
  const actorBProgress = generateActorProgress(data.actor2Attempts, data.actor2Found, WRONG_ATTEMPT, SUCCESS);


  return `🎭 Face Mash #${gameNumber}

A: ${actorAProgress}
B: ${actorBProgress}

${SHARE_CONFIG.WEBSITE_URL}`.trim();
};

/**
 * Generate share text for Connections game (NYT style)
 */
export const generateConnectionsShareText = (data: ConnectionsShareData): string => {
  const gameNumber = SHARE_CONFIG.getGameNumber(data.gameId);
  const { CORRECT, ONE_AWAY, WRONG } = SHARE_CONFIG.COLORS.CONNECTIONS;
  
  // Generate grid based on attempt results
  const grid = data.attemptResults.map(result => {
    switch (result) {
      case 'correct': return CORRECT.repeat(4);
      case 'one_away': return ONE_AWAY.repeat(4);
      case 'wrong': return WRONG.repeat(4);
      default: return WRONG.repeat(4);
    }
  }).join('\n');
  
  const statusLine = data.gameWon
    ? `Puzzle #${gameNumber}`
    : `Puzzle #${gameNumber} (${data.solvedGroups.length}/4 groups)`;

  return `🔗 Connections #${gameNumber}
${grid}

${statusLine}
${SHARE_CONFIG.WEBSITE_URL}`.trim();
};

/**
 * Generate share text for Plot Fusion game
 */
export const generatePlotFusionShareText = (data: PlotFusionShareData): string => {
  const gameNumber = SHARE_CONFIG.getGameNumber(data.gameId);
  const { WRONG_ATTEMPT, SUCCESS } = SHARE_CONFIG.COLORS.FACE_MASH; // Reuse Face Mash colors
  
  // Generate progress for Movie 1
  const movie1Progress = generateActorProgress(data.movie1Attempts, data.movie1Found, WRONG_ATTEMPT, SUCCESS);
  
  // Generate progress for Movie 2
  const movie2Progress = generateActorProgress(data.movie2Attempts, data.movie2Found, WRONG_ATTEMPT, SUCCESS);

  return `🎬 Plot Fusion #${gameNumber}

Movie 1: ${movie1Progress}
Movie 2: ${movie2Progress}

${SHARE_CONFIG.WEBSITE_URL}`.trim();
};

/**
 * Helper function to generate actor progress string
 */
const generateActorProgress = (
  attempts: number, 
  found: boolean, 
  wrongEmoji: string, 
  successEmoji: string
): string => {
  if (attempts === 0) return '';
  
  const wrongAttempts = found ? attempts - 1 : attempts;
  const wrongEmojiArray = Array(wrongAttempts).fill(wrongEmoji);
  const progress = wrongEmojiArray.join(' ');
  
  return found ? (progress ? `${progress} ${successEmoji}` : successEmoji) : progress;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Share via Web Share API (if available)
 */
export const shareViaWebAPI = async (text: string, title: string): Promise<boolean> => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: title,
        text: text
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to share via Web Share API:', error);
    return false;
  }
};

/**
 * Safe encode URI component that handles malformed characters
 */
const safeEncodeURIComponent = (str: string): string => {
  try {
    return encodeURIComponent(str);
  } catch (error) {
    console.error('Error encoding URI component:', error);
    // Fallback: sanitize the string and try again
    const sanitized = str
      .replace(/[\uD800-\uDFFF]/g, '') // Remove surrogate pairs that can cause issues
      .replace(/[^\u0020-\u007E]/g, '') // Keep only printable ASCII characters
      .trim();
    
    try {
      return encodeURIComponent(sanitized);
    } catch (fallbackError) {
      console.error('Fallback encoding also failed:', fallbackError);
      return ''; // Return empty string as last resort
    }
  }
};

/**
 * Generate share text for Glimpsed game
 */
export const generateGlimpsedShareText = (data: GlimpsedShareData): string => {
  const gameNumber = SHARE_CONFIG.getGameNumber(data.gameId);
  const { SUCCESS, WRONG_ATTEMPT } = SHARE_CONFIG.COLORS.FACE_MASH;
  
  // Generate frame progress - one emoji per frame shown
  const frameProgress = Array.from({ length: data.framesShown }, (_, i) => {
    if (i < data.framesShown - 1) {
      return WRONG_ATTEMPT; // Frame shown
    } else if (data.gameWon) {
      return SUCCESS; // Last frame with correct guess
    } else {
      return WRONG_ATTEMPT; // Last frame but wrong guess
    }
  }).join(' ');
  
  // If game was completed with wrong guesses, show remaining frames as not shown
  const maxFrames = 6;
  const remainingFrames = maxFrames - data.framesShown;
  if (!data.gameWon && remainingFrames > 0) {
    // Add dots for remaining frames
    for (let i = 0; i < remainingFrames; i++) {
      // Don't add anything - just show what was revealed
    }
  }

  const resultText = data.gameWon ? 
    `✅ Solved in ${data.totalAttempts} guess${data.totalAttempts !== 1 ? 'es' : ''}!` : 
    `❌ Not solved after ${data.totalAttempts} guesses`;

  return `🎬 Glimpsed #${gameNumber}

${frameProgress}

${resultText}

${SHARE_CONFIG.WEBSITE_URL}/glimpsed`;
};

/**
 * Get shareable URLs for different platforms
 */
export const getShareUrls = (text: string, title: string) => {
  const encodedText = safeEncodeURIComponent(text);
  const encodedTitle = safeEncodeURIComponent(title);
  
  // WhatsApp has issues with certain encoded characters, so we use a lighter encoding
  const whatsappText = text
    .replace(/\n/g, '%0A')  // Replace newlines with %0A
    .replace(/ /g, '%20')   // Replace spaces with %20
    .replace(/#/g, '%23')   // Replace # with %23
    .replace(/&/g, '%26');  // Replace & with %26
  
  return {
    whatsapp: `https://wa.me/?text=${whatsappText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
    telegram: `https://t.me/share/url?text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${safeEncodeURIComponent(SHARE_CONFIG.WEBSITE_URL)}&quote=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${safeEncodeURIComponent(SHARE_CONFIG.WEBSITE_URL)}&title=${encodedTitle}&summary=${encodedText}`
  };
};
