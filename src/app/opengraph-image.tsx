import { ImageResponse } from "next/og";

export const alt = "Forge — Forge your strength";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background:
          "radial-gradient(800px 500px at 70% 0%, rgba(240,87,30,0.22), transparent), #0B0B0E",
        color: "#F5F2EC",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 14,
            background: "#F0571E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 64 64" fill="#0B0B0E">
            <path d="M14 22h28c0 6-5 9-11 9h-1l9 13H25l9-13c-9 0-20-2-20-9z" />
            <rect x="20" y="50" width="24" height="5" rx="1.5" />
          </svg>
        </div>
        <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: 2 }}>FORGE</span>
      </div>

      <div
        style={{
          fontSize: 104,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: -2,
          textTransform: "uppercase",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span>Forge your</span>
        <span style={{ color: "#FF7A1A" }}>strength.</span>
      </div>

      <p style={{ fontSize: 30, color: "#A8A29A", marginTop: 36, maxWidth: 760 }}>
        Learn the lifts, log your workouts, earn Bronze→Platinum medals, and keep your streak.
      </p>
    </div>,
    { ...size },
  );
}
