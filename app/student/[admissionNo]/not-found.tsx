import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="text-center">
        <p className="text-8xl font-black text-indigo-400" style={{ fontFamily: "Outfit, sans-serif" }}>404</p>
        <h1 className="mt-4 text-2xl font-bold">Student Profile Not Found</h1>
        <p className="mt-2 text-slate-400">
          This student profile does not exist or is not publicly visible.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Please check the admission number and try again.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
