import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router";
import heroVideo from "../../imports/jewelry_no_watermark__2___1_-1.mp4";
import { resolveMediaUrl } from "../api";
import { PRIMARY_CTA_BACKGROUND } from "../utils";

interface HeroProps {
  bannerData?: {
    title_line1: string;
    title_line2: string;
    title_line3: string;
    eyebrow_text: string;
    description: string;
    primary_button_text: string;
    primary_button_link: string;
    secondary_button_text: string;
    secondary_button_link: string;
    video: string;
    image: string;
    stats: Array<{ value: string; label: string }>;
  };
}

export function Hero({ bannerData }: HeroProps = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const nextMuted = !v.muted;
    v.muted = nextMuted;
    setMuted(nextMuted);
  };

  const detectAudio = () => {
    const video = videoRef.current as (HTMLVideoElement & {
      audioTracks?: { length: number };
      mozHasAudio?: boolean;
      webkitAudioDecodedByteCount?: number;
      captureStream?: () => MediaStream;
    }) | null;
    if (!video) return;
    let streamHasAudio = 0;
    try {
      streamHasAudio = video.captureStream?.().getAudioTracks().length || 0;
    } catch {
      streamHasAudio = 0;
    }
    setHasAudio(Boolean(
      video.audioTracks?.length ||
      video.mozHasAudio ||
      (video.webkitAudioDecodedByteCount || 0) > 0 ||
      streamHasAudio
    ));
  };

  const videoSource = bannerData?.video ? resolveMediaUrl(bannerData.video) : heroVideo;

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100svh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        background: "#0d0608",
      }}
    >
      {/* ── FULL-SCREEN BACKGROUND VIDEO ── */}
      <video
        key={videoSource}
        ref={videoRef}
        autoPlay
        muted={muted}
        loop
        playsInline
        onLoadedMetadata={detectAudio}
        onTimeUpdate={detectAudio}
        onCanPlay={() => {
          setLoaded(true);
          detectAudio();
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
          zIndex: 0,
          opacity: loaded ? 1 : 0,
          transition: "opacity 1.2s ease",
        }}
      >
        <source src={videoSource} type="video/mp4" />
      </video>

      {/* ── CINEMATIC OVERLAYS ── */}
      {/* Deep vignette — all edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(6,4,2,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Left-to-right directional overlay for text legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background:
            "linear-gradient(105deg, rgba(6,4,2,0.78) 0%, rgba(6,4,2,0.52) 45%, rgba(6,4,2,0.1) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Bottom fade into next section */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "180px",
          zIndex: 3,
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(253,248,248,0.97) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── HERO CONTENT ── */}
      <div
        style={{
          position: "relative",
          zIndex: 4,
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "clamp(6rem, 14vh, 10rem) clamp(1.25rem, 6vw, 4rem)",
        }}
      >
        <div style={{ maxWidth: "640px" }}>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)",
              fontWeight: 600,
              lineHeight: 1.06,
              color: "#ffffff",
              margin: 0,
              marginBottom: "1.5rem",
              letterSpacing: "-0.01em",
            }}
          >
            {bannerData?.title_line1 || "Wear Your"}
            <br />
            <em
              style={{
                fontStyle: "italic",
                background:
                  "linear-gradient(135deg, #F0DC8A 0%, #C9A84C 55%, #8B6914 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {bannerData?.title_line2 || "Inner"}
            </em>
            <br />
            {bannerData?.title_line3 || "Radiance"}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
              fontWeight: 300,
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.7)",
              maxWidth: "440px",
              marginBottom: "2.5rem",
            }}
          >
            {bannerData?.description || "Exquisite handcrafted artificial jewelry — where timeless elegance meets contemporary artistry. Crafted for the discerning modern woman."}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.66, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "3.5rem" }}
          >
            {/* Primary */}
            <Link
              to={bannerData?.primary_button_link || "/products"}
              className="group"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "15px 36px",
                borderRadius: "100px",
                background: PRIMARY_CTA_BACKGROUND,
                color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: "0.88rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: "0 8px 32px rgba(201,168,76,0.45)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(201,168,76,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(201,168,76,0.45)";
              }}
            >
              {bannerData?.primary_button_text || "Shop Collection"}
              <ArrowRight size={15} />
            </Link>

            {/* Secondary */}
            <Link
              to={bannerData?.secondary_button_link || "/#new-arrivals"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "15px 36px",
                borderRadius: "100px",
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.28)",
                color: "rgba(255,255,255,0.92)",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: "0.88rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background 0.25s ease, transform 0.25s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {bannerData?.secondary_button_text || "New Arrivals"}
            </Link>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.82 }}
            style={{ display: "flex", alignItems: "center", gap: "2.5rem", flexWrap: "wrap" }}
          >
            {(bannerData?.stats || [
              { value: "50K+", label: "Happy Customers" },
              { value: "2K+",  label: "Designs" },
              { value: "4.9★", label: "Rating" },
            ]).map((stat, i) => (
              <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {i > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      width: "1px",
                      height: "28px",
                      background: "rgba(255,255,255,0.15)",
                      marginLeft: "-1.25rem",
                    }}
                  />
                )}
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.4rem",
                    fontWeight: 600,
                    color: "#E0C87A",
                    letterSpacing: "0.02em",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── MUTE TOGGLE ── */}
      {hasAudio && <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        onClick={toggleMute}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          right: "clamp(1.25rem, 4vw, 2.5rem)",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "9px 18px",
          borderRadius: "100px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.8)",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.68rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.18)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)")}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        {muted ? "Unmute" : "Mute"}
      </motion.button>}

      {/* ── SCROLL INDICATOR ── */}
      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.58rem",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.38)",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "36px",
            background:
              "linear-gradient(to bottom, rgba(201,168,76,0.7), transparent)",
            borderRadius: "1px",
          }}
        />
      </motion.div>
    </section>
  );
}
