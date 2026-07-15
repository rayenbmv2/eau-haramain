import { useState } from "react";

export function TutorialFab() {
  const [showButton, setShowButton] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  if (!showButton) {
    return (
      <button
        onClick={() => setShowButton(true)}
        className="fixed bottom-4 left-4 z-50 rounded-full bg-primary/80 px-3 py-2 text-xs font-medium text-primary-foreground shadow-lg backdrop-blur transition hover:opacity-90"
      >
        ؟
      </button>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setShowVideo(true)}
          className="rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg transition hover:opacity-90"
          dir="rtl"
        >
          كيفاش نعدي كوماند ؟
        </button>
        <button
          onClick={() => setShowButton(false)}
          aria-label="Hide"
          className="rounded-full bg-muted px-2 py-2 text-xs font-medium text-muted-foreground shadow-lg transition hover:opacity-90"
        >
          ✕
        </button>
      </div>

      {showVideo && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-card p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              aria-label="Close video"
              className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
            >
              ✕
            </button>
            <video
              src="/copy_7CE52044-1834-451B-B8D0-328FD136FA59.mp4"
              controls
              autoPlay
              className="w-full rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
