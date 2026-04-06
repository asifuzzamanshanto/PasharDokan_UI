import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal public nav */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PD</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-primary leading-tight">PasharDokan</span>
              <span className="text-[10px] text-text-tertiary leading-tight">Shop Operations Platform</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/apply" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Apply
            </Link>
            <Link href="/auth/signin" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
