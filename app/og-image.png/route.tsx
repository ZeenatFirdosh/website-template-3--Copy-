import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        backgroundColor: "#000",
        padding: "80px",
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-3px",
          lineHeight: 1,
          marginBottom: 24,
        }}
      >
        {site.name}
      </div>
      <div
        style={{
          fontSize: 32,
          color: "#a1a1aa",
          lineHeight: 1.4,
        }}
      >
        {site.tagline}
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
