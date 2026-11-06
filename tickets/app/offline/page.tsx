
"use client";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold">
        You are offline
      </h1>

      <p className="mt-3 text-muted-foreground">
        Please check your internet connection
        and try again.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="mt-6 rounded-lg bg-black px-5 py-3 text-white"
      >
        Try Again
      </button>
    </main>
  );
}
