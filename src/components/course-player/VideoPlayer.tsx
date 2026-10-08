"use client";

import { useEffect, useRef, useState } from "react";
import type { Course, Lesson } from "@/types/course";
import { MaximizeIcon, PauseIcon, PlayIcon, WideIcon } from "@/components/ui/Icon";
import styles from "./VideoPlayer.module.css";

/** Royalty-free sample clips used as mock lesson videos. */
const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
];

const LESSON_POSTER = "/images/poster.jpg";

/** Extract a YouTube video id from a watch / share / shorts URL. */
function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
}

interface VideoPlayerProps {
  course: Course;
  lesson?: Lesson;
  lessonNumber: number;
  wide: boolean;
  /** Increments when the player should auto-start the new lesson (auto-advance). */
  autoPlayToken?: number;
  onToggleWide: () => void;
  onEnded: () => void;
}

/**
 * Lesson video player, sized exactly like the reference (opens in place, not
 * in a popup). Every lesson starts as a still poster with a play button;
 * pressing play starts the actual video — a bundled clip, any .mp4 link, or
 * a YouTube URL (rendered as a thumbnail facade that swaps to the embed).
 * "Wide" switches the page to theater layout on desktop and "Maximize"
 * opens real fullscreen on both desktop and mobile.
 */
export default function VideoPlayer({
  course,
  lesson,
  lessonNumber,
  wide,
  autoPlayToken = 0,
  onToggleWide,
  onEnded,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastAutoPlayToken = useRef(autoPlayToken);
  const endedFired = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  const youTubeId = getYouTubeId(lesson?.videoUrl);
  const src =
    lesson?.videoUrl && !youTubeId
      ? lesson.videoUrl
      : SAMPLE_VIDEOS[Math.max(0, lessonNumber - 1) % SAMPLE_VIDEOS.length];

  /* Reset playback when the lesson changes; auto-start it when the change
     came from auto-advance (previous video finished). */
  useEffect(() => {
    setPlaying(false);
    setStarted(false);
    endedFired.current = false;
    videoRef.current?.pause();
    videoRef.current?.load();

    if (lastAutoPlayToken.current !== autoPlayToken) {
      lastAutoPlayToken.current = autoPlayToken;
      if (youTubeId) {
        // YouTube lesson: load the embed immediately with autoplay
        setStarted(true);
        setPlaying(true);
      } else {
        videoRef.current?.play().catch(() => {});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id, autoPlayToken]);

  /* ----- detect when a YouTube embed finishes (enablejsapi postMessage).
         The widget starts reporting state after a "listening" handshake;
         playerState 0 = ended → advance like a native video. ----- */
  useEffect(() => {
    if (!started || !youTubeId) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        const state = data?.info?.playerState ?? (data?.event === "onStateChange" ? data?.info : null);
        if (state === 0 && !endedFired.current) {
          endedFired.current = true;
          setPlaying(false);
          onEnded();
        }
      } catch {
        /* non-JSON message — ignore */
      }
    };

    window.addEventListener("message", handleMessage);
    // handshake (retried until the player answers) so the embed sends events
    const handshake = window.setInterval(() => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening", id: youTubeId, channel: "widget" }),
        "https://www.youtube.com"
      );
    }, 500);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.clearInterval(handshake);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, youTubeId]);

  const togglePlay = () => {
    if (youTubeId) {
      // facade → swap in the autoplaying embed; completion is detected
      // for real when the embed reports the video ended
      if (!started) {
        setStarted(true);
        setPlaying(true);
      }
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      // ignore AbortError when a lesson switch interrupts a pending play()
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const enterFullscreen = () => {
    const container = containerRef.current;
    const video = videoRef.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;
    if (container?.requestFullscreen) {
      void container.requestFullscreen();
    } else if (video?.webkitEnterFullscreen) {
      // iOS Safari fallback — works even with Auto-Rotate off
      video.webkitEnterFullscreen();
    }
  };

  return (
    <figure className={styles.wrapper}>
      <div ref={containerRef} className={styles.frame}>
        {youTubeId ? (
          started ? (
            <iframe
              ref={iframeRef}
              className={styles.video}
              src={`https://www.youtube.com/embed/${youTubeId}?autoplay=1&rel=0&enablejsapi=1`}
              title={`Video: ${lesson?.title ?? course.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            // course poster facade — the embed loads only when played
            // eslint-disable-next-line @next/next/no-img-element
            <img className={styles.video} src={LESSON_POSTER} alt="" />
          )
        ) : (
          <video
            ref={videoRef}
            className={styles.video}
            poster={LESSON_POSTER}
            preload="metadata"
            playsInline
            onPlay={() => {
              setPlaying(true);
              setStarted(true);
            }}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              onEnded();
            }}
            onClick={togglePlay}
          >
            <source src={src} type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
        )}

        {!started && <div className={styles.scrim} aria-hidden="true" />}

        {!playing && (
          <button
            type="button"
            className={styles.playOverlay}
            onClick={togglePlay}
            aria-label={`Play lesson: ${lesson?.title ?? course.title}`}
          >
            <PlayIcon size={30} className={styles.playTriangle} />
          </button>
        )}

        <div className={styles.controls}>
          {!youTubeId && (
            <button
              type="button"
              className={styles.controlBtn}
              onClick={togglePlay}
              aria-label={playing ? "Pause video" : "Play video"}
            >
              {playing ? <PauseIcon size={17} /> : <PlayIcon size={17} />}
            </button>
          )}

          <div className={styles.controlSpacer} />

          <button
            type="button"
            className={`${styles.controlBtn} ${styles.wideBtn} ${wide ? styles.active : ""}`}
            onClick={onToggleWide}
            aria-pressed={wide}
            aria-label={wide ? "Exit wide view" : "Wide view"}
            title="Wide"
          >
            <WideIcon size={17} />
          </button>

          <button
            type="button"
            className={styles.controlBtn}
            onClick={enterFullscreen}
            aria-label="Maximize (fullscreen)"
            title="Maximize"
          >
            <MaximizeIcon size={17} />
          </button>
        </div>
      </div>

      {lesson && (
        <figcaption className={styles.nowPlaying}>
          <span className={styles.nowPlayingDot} aria-hidden="true" />
          Lesson {lessonNumber}: <strong>{lesson.title}</strong>
        </figcaption>
      )}
    </figure>
  );
}
