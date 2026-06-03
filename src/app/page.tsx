import { ClerkLoaded, ClerkLoading, Show, SignUpButton } from "@clerk/nextjs";
import { BasketWorkspace } from "@/components/BasketWorkspace";
import { PageSpinner } from "@/components/PageSpinner";

export default function Home() {
  return (
    <>
      <ClerkLoading>
        <PageSpinner />
      </ClerkLoading>
      <ClerkLoaded>
        <Show when="signed-in">
          <BasketWorkspace />
        </Show>
        <Show when="signed-out">
          <Landing />
        </Show>
      </ClerkLoaded>
    </>
  );
}

function Landing() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        Groceries · Coles vs Woolworths
      </span>
      <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Stop guessing which store is cheaper.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
        Cart Compass takes your regular basket — typed in or scanned from a
        receipt — and tells you whether Coles or Woolworths will save you more
        this week, and by how much.
      </p>

      <div className="mt-8 flex justify-center">
        <SignUpButton mode="modal">
          <button className="rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-700">
            Compare my basket — it’s free
          </button>
        </SignUpButton>
      </div>

      <div className="mx-auto mt-14 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
        <Feature
          title="Snap a receipt"
          body="Upload a photo and AI turns it into a basket in seconds."
        />
        <Feature
          title="Or add manually"
          body="Search common staples and set your usual quantities."
        />
        <Feature
          title="See the saving"
          body="A clear weekly winner, plus your savings over time."
        />
      </div>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{body}</p>
    </div>
  );
}
