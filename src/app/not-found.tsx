import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg p-4">
      <div className="max-w-md text-center">
        <div className="mb-4 text-6xl font-bold text-gray-600">404</div>
        <h1 className="mb-2 text-xl font-bold text-white">Page Not Found</h1>
        <p className="mb-6 text-sm text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
