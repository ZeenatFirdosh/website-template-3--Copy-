"use client";

import { captureException } from "@sentry/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h2 className="font-semibold text-2xl tracking-tight">
          Something went wrong!
        </h2>
        <Button onClick={() => unstable_retry()}>Try again</Button>
      </body>
    </html>
  );
}
