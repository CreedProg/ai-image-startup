"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-12">
        <div className="text-xl font-bold tracking-tight">
          YOUR<span className="text-violet-400">AI</span>
        </div>

        <div className="hidden gap-8 text-sm text-zinc-400 md:flex">
          <a href="#features" className="hover:text-white">
            Features
          </a>

          <a href="#pricing" className="hover:text-white">
            Pricing
          </a>
        </div>

        {/* Working Sign In button */}
        <button
          onClick={() => {
            window.location.href = "/auth";
          }}
          className="rounded-full border border-white/15 px-5 py-2 text-sm transition hover:bg-white hover:text-black"
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-20 pt-24 text-center md:pt-32">

        <div className="mb-6 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300">
          ✨ AI Image Generation
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          Turn your imagination

          <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            into reality.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Create stunning, realistic AI images from simple text prompts.
          Fast, creative and made for everyone.
        </p>

        {/* Generator Box */}
        <div className="mt-12 w-full max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-violet-500/10">

          <div className="rounded-2xl bg-zinc-950 p-5">

            <textarea
              placeholder="Describe the image you want to create..."
              className="min-h-32 w-full resize-none bg-transparent text-lg text-white outline-none placeholder:text-zinc-600"
            />

            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="text-sm text-zinc-500">
                100 free credits available
              </div>

              <button className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-violet-200">
                ✨ Generate Image
              </button>

            </div>
          </div>
        </div>

        <p className="mt-5 text-xs text-zinc-600">
          Start creating for free • No credit card required
        </p>

      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t border-white/10 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">

          <div className="mb-12">
            <p className="text-sm font-medium text-violet-400">
              FEATURES
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Everything you need to create.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <div className="mb-5 text-3xl">⚡</div>

              <h3 className="text-xl font-semibold">
                Fast Generation
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Turn your ideas into beautiful images in seconds.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <div className="mb-5 text-3xl">🎨</div>

              <h3 className="text-xl font-semibold">
                Realistic Results
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Generate detailed and photorealistic visuals from your prompts.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <div className="mb-5 text-3xl">💎</div>

              <h3 className="text-xl font-semibold">
                Credit System
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Start free and upgrade whenever you need more generations.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">

          <div className="mb-12 text-center">
            <p className="text-sm font-medium text-violet-400">
              PRICING
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Choose your creative power.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {/* Free */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

              <h3 className="text-xl font-semibold">
                Free
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Start creating without paying.
              </p>

              <div className="mt-6 text-4xl font-bold">
                ₹0
                <span className="text-sm font-normal text-zinc-500">
                  /month
                </span>
              </div>

              <div className="my-7 h-px bg-white/10" />

              <p className="text-sm text-zinc-300">
                ✓ 100 credits / month
              </p>

              <p className="mt-3 text-sm text-zinc-300">
                ✓ Standard generation
              </p>

              <button
                onClick={() => {
                  window.location.href = "/auth";
                }}
                className="mt-8 w-full rounded-xl border border-white/15 py-3 text-sm font-medium hover:bg-white hover:text-black"
              >
                Get Started
              </button>

            </div>

            {/* Starter */}
            <div className="rounded-3xl border border-violet-400/40 bg-violet-500/[0.08] p-8">

              <div className="mb-4 inline-block rounded-full bg-violet-400/15 px-3 py-1 text-xs text-violet-300">
                POPULAR
              </div>

              <h3 className="text-xl font-semibold">
                Starter
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                For regular creators.
              </p>

              <div className="mt-6 text-4xl font-bold">
                ₹299
                <span className="text-sm font-normal text-zinc-500">
                  /month
                </span>
              </div>

              <div className="my-7 h-px bg-white/10" />

              <p className="text-sm text-zinc-300">
                ✓ 200 credits / month
              </p>

              <p className="mt-3 text-sm text-zinc-300">
                ✓ Higher quality
              </p>

              <p className="mt-3 text-sm text-zinc-300">
                ✓ Image history
              </p>

              <button
                onClick={() => {
                  window.location.href = "/auth";
                }}
                className="mt-8 w-full rounded-xl bg-white py-3 text-sm font-semibold text-black hover:bg-violet-200"
              >
                Start Creating
              </button>

            </div>

            {/* Pro */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

              <h3 className="text-xl font-semibold">
                Pro
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                For serious creators.
              </p>

              <div className="mt-6 text-4xl font-bold">
                ₹799
                <span className="text-sm font-normal text-zinc-500">
                  /month
                </span>
              </div>

              <div className="my-7 h-px bg-white/10" />

              <p className="text-sm text-zinc-300">
                ✓ 400 credits / month
              </p>

              <p className="mt-3 text-sm text-zinc-300">
                ✓ Premium generation
              </p>

              <p className="mt-3 text-sm text-zinc-300">
                ✓ Priority processing
              </p>

              <button
                onClick={() => {
                  window.location.href = "/auth";
                }}
                className="mt-8 w-full rounded-xl border border-white/15 py-3 text-sm font-medium hover:bg-white hover:text-black"
              >
                Go Pro
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-zinc-600">
        © 2026 YourAI. Create without limits.
      </footer>

    </main>
  );
}