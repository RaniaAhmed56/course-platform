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
  onToggleWide,
  onEnded,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  const youTubeId = getYouTubeId(lesson?.videoUrl);
  const src =
    lesson?.videoUrl && !youTubeId
      ? lesson.videoUrl
      : SAMPLE_VIDEOS[Math.max(0, lessonNumber - 1) % SAMPLE_VIDEOS.length];

  /* Reset playback when the lesson changes */
  useEffect(() => {
    setPlaying(false);
    setStarted(false);
    videoRef.current?.pause();
    videoRef.current?.load();
  }, [lesson?.id]);

  const togglePlay = () => {
    if (youTubeId) {
      // facade → swap in the autoplaying embed; count the lesson as watched
      if (!started) {
        setStarted(true);
        setPlaying(true);
        onEnded();
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
              className={styles.video}
              src={`https://www.youtube.com/embed/${youTubeId}?autoplay=1&rel=0`}
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
