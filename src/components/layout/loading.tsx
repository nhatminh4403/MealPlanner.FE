"use client";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-0.5 z-100 pointer-events-none">
      <div
        className="h-full bg-linear-to-r from-primary to-secondary opacity-75"
        style={{
          animation: "load-bar 2s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      <style jsx>{`
        @keyframes load-bar {
          0% {
            transform: scaleX(0);
            transform-origin: left;
          }
          50% {
            transform: scaleX(0.7);
            transform-origin: left;
          }
          100% {
            transform: scaleX(1);
            transform-origin: right;
          }
        }
      `}</style>
    </div>
  );
}
