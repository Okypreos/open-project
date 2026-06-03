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

const STORES = ["Coles", "Woolworths", "Aldi"];

function Landing() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-80 bg-linear-to-b from-emerald-100/70 to-transparent blur-2xl" />

      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:py-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Compare across 3 supermarkets
        </span>

        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Stop guessing which store is cheaper.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          TrolleyWise takes your regular trolley and tells you which supermarket saves you the most, and by
          how much!
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {STORES.map((store) => (
            <span
              key={store}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm"
            >
              {store}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <SignUpButton mode="modal">
            <button className="rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow">
              Compare my trolley — it’s free
            </button>
          </SignUpButton>
          <p className="text-sm text-slate-500">
            No credit card · takes under a minute
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
          <Feature
            icon={<ReceiptIcon />}
            title="Snap a receipt"
            body="Upload a photo and AI turns it into a trolley in seconds."
          />
          <Feature
            icon={<SearchIcon />}
            title="Or add manually"
            body="Search common staples and set your usual quantities."
          />
          <Feature
            icon={<SavingsIcon />}
            title="See the saving"
            body="A clear winner, plus your savings tracked over time."
          />
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
        {icon}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{body}</p>
    </div>
  );
}

const iconProps = {
  className: "h-5 w-5",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.8,
  stroke: "currentColor",
} as const;

function ReceiptIcon() {
  return (
    <svg {...iconProps}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 3.75h12v16.5l-2.25-1.5-2.25 1.5-1.5-1.5-1.5 1.5-2.25-1.5L6 20.25V3.75Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25h6M9 12h6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg {...iconProps}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"
      />
    </svg>
  );
}

function SavingsIcon() {
  return (
    <svg {...iconProps}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 17.25 9 11.25l3.75 3.75L21 6.75M21 6.75h-4.5M21 6.75v4.5"
      />
    </svg>
  );
}
