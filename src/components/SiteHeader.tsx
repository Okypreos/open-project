import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white">
            $
          </span>
          <span className="text-lg tracking-tight">TrolleyWise</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3">
          <Show when="signed-in">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Compare
            </Link>
            <Link
              href="/baskets"
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Trolleys
            </Link>
            <div className="ml-1">
              <UserButton />
            </div>
          </Show>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                Get started
              </button>
            </SignUpButton>
          </Show>
        </nav>
      </div>
    </header>
  );
}
