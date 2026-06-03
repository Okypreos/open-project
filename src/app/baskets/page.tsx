import { ClerkLoaded, ClerkLoading, Show, SignInButton } from "@clerk/nextjs";
import { HistoryView } from "@/components/HistoryView";
import { PageSpinner } from "@/components/PageSpinner";

export default function BasketsPage() {
  return (
    <>
      <ClerkLoading>
        <PageSpinner />
      </ClerkLoading>
      <ClerkLoaded>
        <Show when="signed-in">
          <HistoryView />
        </Show>
        <Show when="signed-out">
          <div className="mx-auto max-w-md px-4 py-24 text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Sign in to see your trolleys
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Your saved trolleys and total savings are saved to your account.
            </p>
            <div className="mt-6">
              <SignInButton mode="modal">
                <button className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
                  Sign in
                </button>
              </SignInButton>
            </div>
          </div>
        </Show>
      </ClerkLoaded>
    </>
  );
}
