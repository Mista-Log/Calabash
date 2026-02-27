export default function AppShellLoading() {
  return (
    <div className="w-full px-3 py-5 sm:px-5 sm:py-7 lg:px-7 lg:py-9">
      <div className="mx-auto w-full max-w-[1360px] space-y-6">
        <div className="h-10 w-72 animate-pulse rounded-2xl bg-[color:var(--md-sys-color-surface-container-high)]" />
        <div className="h-5 w-[min(560px,90%)] animate-pulse rounded-xl bg-[color:var(--md-sys-color-surface-container)]" />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="space-y-5 xl:col-span-8">
            <div className="h-52 animate-pulse rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="h-44 animate-pulse rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]" />
              <div className="h-44 animate-pulse rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]" />
            </div>
            <div className="h-56 animate-pulse rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]" />
          </div>

          <div className="space-y-5 xl:col-span-4">
            <div className="h-44 animate-pulse rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]" />
            <div className="h-56 animate-pulse rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]" />
            <div className="h-52 animate-pulse rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
