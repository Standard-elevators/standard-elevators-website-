import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-soft-background px-6 py-20">
      <div className="max-w-md w-full text-center">
        <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent-blue mb-3 inline-block">
          Error 404
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-deep-navy mb-4 tracking-tight">
          Floor Not Found
        </h1>
        <p className="text-body-text font-normal text-sm sm:text-base leading-relaxed mb-8">
          The requested level or document does not exist, has been relocated, or is temporarily out of service.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-blue hover:bg-accent-blue-hover text-white rounded-sm text-sm font-semibold transition-colors shadow-md shadow-accent-blue/15"
          >
            <Home className="w-4 h-4" />
            Return to Ground Floor (Home)
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-subtle-border hover:border-body-text/30 text-deep-navy rounded-sm text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Services
          </Link>
        </div>
      </div>
    </div>
  );
}
