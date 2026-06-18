import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans">
      <main className="flex w-full max-w-3xl flex-1 flex-col justify-center bg-white px-16 py-32">
        <p className="font-mono text-sm text-zinc-400">404</p>
        <h1 className="mt-4 font-semibold text-3xl text-black leading-10 tracking-tight">
          Page not found
        </h1>
        <p className="mt-4 text-sm text-zinc-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          className="mt-8 text-sm text-zinc-900 underline underline-offset-4 transition-colors hover:text-zinc-600"
          href="/"
        >
          Go back home
        </Link>
      </main>
    </div>
  );
}
