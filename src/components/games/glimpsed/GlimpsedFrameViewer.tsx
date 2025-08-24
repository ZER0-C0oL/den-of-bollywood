import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { GlimpsedGameData } from '../../../types/gameTypes';
import { GlimpsedGameState, GlimpsedGameService } from './GlimpsedGameService';
import { getMovieById } from '../../../data/moviesData';

interface GlimpsedFrameViewerProps {
  gameData: GlimpsedGameData;
  gameState: GlimpsedGameState;
}

export interface GlimpsedFrameViewerHandle {
  playRemaining: () => Promise<void>;
}

const GlimpsedFrameViewer = forwardRef<GlimpsedFrameViewerHandle, GlimpsedFrameViewerProps>(({ gameData, gameState }, ref) => {
  const movieData = getMovieById(gameData.movieId);
  const [selectedFrame, setSelectedFrame] = useState(gameState.currentFrame);

  const minFrame = 1;
  // If game is completed (correct guess or max attempts reached), allow navigation through all frames and the poster (frame 7)
  const isCompleted = gameState.gameCompleted || gameState.showAnswer;
  const maxFrame = isCompleted ? 7 : gameState.currentFrame;

  // When game completes, default to showing the poster (frame 7). Otherwise follow currentFrame.
  useEffect(() => {
    // If developer explicitly requested to show the answer (showAnswer) or the game completed
    // without a correct guess, jump to the poster. If the user correctly guessed (movieFound),
    // avoid forcing the poster so autoplay can start from the current frame without a flicker.
    if (gameState.showAnswer && !gameState.movieFound) {
      setSelectedFrame(7);
      return;
    }

    if (gameState.gameCompleted && !gameState.movieFound) {
      setSelectedFrame(7);
      return;
    }

    // Only update selectedFrame when the current frame actually changed. This prevents a brief
    // flicker to poster or other frames when game completion toggles but the user found the movie
    // and we're about to autoplay remaining frames.
    setSelectedFrame(prev => (prev !== gameState.currentFrame ? gameState.currentFrame : prev));
  }, [gameState.currentFrame, gameState.gameCompleted, gameState.showAnswer, gameState.movieFound]);

  // Ensure selectedFrame stays within allowed range
  useEffect(() => {
    setSelectedFrame(prev => Math.min(Math.max(prev, minFrame), maxFrame));
  }, [maxFrame]);

  // Animation state: performs a two-phase animation (out then in) totaling >= 1s
  const OUT_MS = 400;
  const IN_MS = 800; // total 1200ms
  const [animating, setAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'animate'>('idle');
  const [animationDirection, setAnimationDirection] = useState<1 | -1>(1); // 1 => next (right), -1 => prev (left)
  const [prevFrame, setPrevFrame] = useState<number | null>(null);
  const timers = React.useRef<number[]>([]);
  const frameBoxRef = useRef<HTMLDivElement | null>(null);
  const [errorFrames, setErrorFrames] = useState<Record<number, boolean>>({});

  const markFrameError = (frame: number) => {
    setErrorFrames(prev => ({ ...prev, [frame]: true }));
  };

  // cleanup timers on unmount
  useEffect(() => {
    return () => {
      timers.current.forEach(id => clearTimeout(id));
      timers.current = [];
    };
  }, []);

  const startTransition = useCallback((newFrame: number, direction: 1 | -1): Promise<void> => {
    return new Promise(resolve => {
      if (animating) {
        resolve();
        return;
      }

      const current = selectedFrame;
      setPrevFrame(current);
      // Mount the incoming frame immediately so both images exist in the DOM
      setSelectedFrame(newFrame);
      setAnimating(true);
      setAnimationDirection(direction);

      // Start both outgoing and incoming animations in the next frame so transitions run in parallel
      window.requestAnimationFrame(() => setAnimationPhase('animate'));

      // Wait for the longer of the two animations, then clean up
      const totalWait = Math.max(OUT_MS, IN_MS);
      const t = window.setTimeout(() => {
        setAnimating(false);
        setAnimationPhase('idle');
        setPrevFrame(null);
        resolve();
      }, totalWait);

      timers.current.push(t);
    });
  }, [animating, selectedFrame]);
  // Expose imperative method to play remaining frames from current to poster
  useImperativeHandle(ref, () => ({
    playRemaining: async () => {
      const start = selectedFrame;
      for (let f = start + 1; f <= 7; f++) {
        // show current frame for 0.1s
        await new Promise(r => setTimeout(r, 100));
        // slide to next
        // eslint-disable-next-line no-await-in-loop
        await startTransition(f, 1);
      }
    }
  }), [selectedFrame, startTransition]);

  const framePath = selectedFrame === 7
    ? GlimpsedGameService.getMovieImagePath(gameData)
    : GlimpsedGameService.getFrameImagePath(gameData, selectedFrame);
  // Use movieData for accessible labels when showing poster
  const movieTitle = movieData?.name || gameData.movieName;

  const handlePrev = () => {
    if (animating) return;
    if (selectedFrame > minFrame) startTransition(selectedFrame - 1, -1);
  };
  const handleNext = () => {
    if (animating) return;
    if (selectedFrame < maxFrame) {
      startTransition(selectedFrame + 1, 1);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-center items-center mb-6 gap-4">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          disabled={selectedFrame === minFrame || animating}
          className={`p-2 rounded-full border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors ${(selectedFrame === minFrame || animating) ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Previous frame"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Frame Image with animated transitions */}
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-center" style={{ width: '100%', maxWidth: '42rem' }}>
          <div className="relative w-full flex items-center justify-center" style={{ minHeight: selectedFrame === 7 ? '24rem' : '16rem' }}>
            {/* Frame box with fixed border so border stays consistent while images animate */}
            <div
              ref={frameBoxRef}
              className="relative rounded-lg overflow-hidden bg-gray-50 border-2 border-gray-200 flex items-center justify-center"
              style={{ width: '100%', maxWidth: '42rem', height: selectedFrame === 7 ? '24rem' : '16rem' }}
            >
              {/* Non-animating single image */}
              {!animating && (
                <>
                  {errorFrames[selectedFrame] ? (
                    <div className={`w-full h-full flex items-center justify-center bg-gray-200`}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎬</div>
                        <div className="text-lg font-semibold">{movieTitle}</div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={framePath}
                      alt={selectedFrame === 7 ? `${movieTitle} poster` : `Movie frame ${selectedFrame}`}
                      className="max-w-full max-h-full object-contain"
                      onError={() => markFrameError(selectedFrame)}
                    />
                  )}
                </>
              )}

            {/* Animated outgoing + incoming images */}
            {animating && (
              <>
                {/* Outgoing (previous) */}
                {prevFrame !== null && (
                  <>
                    {errorFrames[prevFrame] ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎬</div>
                          <div className="text-lg">Frame {prevFrame}</div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={prevFrame === 7 ? GlimpsedGameService.getMovieImagePath(gameData) : GlimpsedGameService.getFrameImagePath(gameData, prevFrame)}
                        alt={prevFrame === 7 ? `${movieTitle} poster` : `Movie frame ${prevFrame}`}
                        className="absolute object-contain"
                        style={{
                          inset: 0,
                          margin: 'auto',
                          width: 'auto',
                          maxWidth: '42rem',
                          maxHeight: '24rem',
                          transition: `transform ${OUT_MS}ms cubic-bezier(.22,.9,.37,1), opacity ${OUT_MS}ms ease`,
                          transform: (animationPhase === 'animate') ? `translateX(${-animationDirection * 100}%)` : 'translateX(0%)',
                          opacity: (animationPhase === 'animate') ? 0 : 1,
                        }}
                        onError={() => markFrameError(prevFrame)}
                      />
                    )}
                  </>
                )}

                {/* Incoming (current selectedFrame) */}
                {errorFrames[selectedFrame] ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎬</div>
                      <div className="text-lg font-semibold">{movieTitle}</div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={selectedFrame === 7 ? GlimpsedGameService.getMovieImagePath(gameData) : GlimpsedGameService.getFrameImagePath(gameData, selectedFrame)}
                    alt={selectedFrame === 7 ? `${movieTitle} poster` : `Movie frame ${selectedFrame}`}
                    className="absolute object-contain"
                    style={{
                      inset: 0,
                      margin: 'auto',
                      width: 'auto',
                      maxWidth: '42rem',
                      maxHeight: '24rem',
                      transition: `transform ${IN_MS}ms cubic-bezier(.22,.9,.37,1), opacity ${IN_MS}ms ease`,
                      // incoming should be off-screen until 'in'
                      transform: (animationPhase === 'animate') ? 'translateX(0%)' : `translateX(${animationDirection * 100}%)`,
                      opacity: (animationPhase === 'animate') ? 1 : 0,
                    }}
                    onError={() => markFrameError(selectedFrame)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={selectedFrame === maxFrame || animating}
          className={`p-2 rounded-full border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors ${(selectedFrame === maxFrame || animating) ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Next frame"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {!isCompleted && (
        <div className="text-center text-gray-600 text-sm">Frame {selectedFrame} of 6</div>
      )}
    </div>
  );
});

export default GlimpsedFrameViewer;