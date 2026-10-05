"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [credits, setCredits] = useState(0);
  const [plan, setPlan] = useState("FREE");
  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth";
        return;
      }

      setEmail(user.email || "");

      const { data, error } = await supabase
        .from("profiles")
        .select("credits, plan")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile error:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
      } else if (data) {
        setCredits(data.credits);
        setPlan(data.plan);
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  async function handleGenerate() {
    if (!prompt.trim() || credits <= 0 || generating) {
      return;
    }

    setGenerating(true);
    setGeneratedImage("");

    try {
      // Get current logged-in session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("Your session has expired. Please login again.");
        window.location.href = "/auth";
        return;
      }

      // Send authenticated request to backend
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Image generation failed.");
        return;
      }

      if (!data.image) {
        alert("No image was returned.");
        return;
      }

      // Show generated image
      setGeneratedImage(data.image);

      // Update credits in the UI
      if (data.creditUsed) {
        setCredits((currentCredits) =>
          Math.max(0, currentCredits - 1)
        );
      }
    } catch (error) {
      console.error("Generate error:", error);
      alert("Something went wrong while generating the image.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">
          Loading your dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-12">
        <div className="text-xl font-bold tracking-tight">
          YOUR<span className="text-violet-400">AI</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-sm text-zinc-400 sm:block">
            {email}
          </div>

          <button
            onClick={handleLogout}
            className="rounded-full border border-white/15 px-4 py-2 text-sm transition hover:bg-white hover:text-black"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-medium text-violet-400">
            AI IMAGE STUDIO
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Create something amazing.
          </h1>

          <p className="mt-3 text-zinc-500">
            Turn your ideas into realistic AI images.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {/* Credits */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-zinc-500">
              Available Credits
            </p>

            <p className="mt-2 text-3xl font-bold">
              {credits}
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Credits remaining
            </p>
          </div>

          {/* Plan */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-zinc-500">
              Current Plan
            </p>

            <p className="mt-2 text-3xl font-bold">
              {plan}
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Upgrade anytime
            </p>
          </div>

          {/* Images */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-zinc-500">
              Images Created
            </p>

            <p className="mt-2 text-3xl font-bold">
              {generatedImage ? "1" : "0"}
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Your creations
            </p>
          </div>
        </div>

        {/* Generate Box */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-7">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Generate an image
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Describe exactly what you want to create.
            </p>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: A cinematic portrait of a futuristic Indian city at sunset, ultra realistic, dramatic lighting..."
            className="min-h-40 w-full resize-none rounded-2xl border border-white/10 bg-black p-5 text-white outline-none placeholder:text-zinc-600 focus:border-violet-400/50"
          />

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-zinc-500">
              ✨ 1 credit per generation
            </div>

            <button
              onClick={handleGenerate}
              disabled={
                !prompt.trim() ||
                credits <= 0 ||
                generating
              }
              className="rounded-xl bg-white px-7 py-3 font-semibold text-black transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {generating
                ? "✨ Generating..."
                : "✨ Generate Image"}
            </button>
          </div>
        </div>

        {/* Generated Image */}
        {generatedImage && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Your generated image
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Created from your prompt.
              </p>
            </div>

            <img
              src={generatedImage}
              alt="Generated AI image"
              className="w-full rounded-2xl"
            />

            <div className="mt-4">
              <a
                href={generatedImage}
                download="ai-generated-image.png"
                className="inline-block rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-violet-200"
              >
                Download Image
              </a>
            </div>
          </div>
        )}

        {/* Empty Gallery */}
        {!generatedImage && (
          <div className="mt-12">
            <div className="mb-5">
              <h2 className="text-2xl font-bold">
                Your creations
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Your generated images will appear here.
              </p>
            </div>

            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
              <div className="text-5xl">
                🖼️
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                No images yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">
                Enter a prompt above and generate your first AI image.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}