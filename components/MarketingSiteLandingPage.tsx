"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Safe client-side SEO helper: sets document.title and meta tags only in the browser.
function useClientSideMeta() {
  useEffect(() => {
    try {
      const title = "Voicemail Genie — AI Voicemail Greeting Creator";
      const description = "Create studio-quality voicemail greetings using AI. Instant scripts, realistic voices, and fast downloads.";
      const image = "/og-voicemail-genie.png";

      if (typeof document !== "undefined") {
        document.title = title;

        function upsertMeta(attrName: string, attrValue: string, content: string) {
          const selector = `meta[${attrName}="${attrValue}"]`;
          let el = document.head.querySelector(selector) as HTMLMetaElement | null;
          if (!el) {
            el = document.createElement("meta");
            el.setAttribute(attrName, attrValue);
            document.head.appendChild(el);
          }
          el.setAttribute("content", content);
        }

        upsertMeta("name", "description", description);
        upsertMeta("property", "og:title", "Voicemail Genie");
        upsertMeta("property", "og:description", description);
        upsertMeta("property", "og:image", image);
        upsertMeta("property", "og:type", "website");
        upsertMeta("name", "twitter:card", "summary_large_image");
        upsertMeta("name", "twitter:title", "Voicemail Genie");
        upsertMeta("name", "twitter:description", description);
        upsertMeta("name", "twitter:image", image);
      }
    } catch (err) {
      // Defensive: don't let meta tag errors break rendering
      // In the sandboxed environment some DOM APIs may be unavailable.
      // We swallow errors intentionally and continue rendering the page.
      // eslint-disable-next-line no-console
      console.warn("Meta tags could not be applied:", err);
    }
  }, []);
}

export default function LandingPage() {
  useClientSideMeta();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-800 text-white p-6">
      {/* Hero Section */}
      <section className="max-w-3xl mx-auto text-center py-20 space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold tracking-tight"
        >
          Voicemail Genie
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xl opacity-90"
        >
          Instantly create studio-quality voicemail greetings using AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-4"
        >
          <a href="/create"><Button className="bg-yellow-400 text-black font-bold text-lg px-6 py-4 rounded-xl shadow-xl hover:bg-yellow-300">Get Started →</Button></a>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mt-10">
        {[
          {
            title: "AI-Written Scripts",
            desc: "Professional, funny, or themed greetings written automatically.",
          },
          {
            title: "Crystal-Clear Voices",
            desc: "Generate natural-sounding audio in seconds.",
          },
          {
            title: "Fast & Easy",
            desc: "Record → Generate → Pay → Download. All under one minute.",
          },
        ].map((f, i) => (
          <Card
            key={i}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
          >
            <h3 className="text-2xl font-semibold mb-2">{f.title}</h3>
            <p className="opacity-90">{f.desc}</p>
          </Card>
        ))}
      </section>

      {/* How it Works */}
      <section className="max-w-3xl mx-auto text-center mt-20 space-y-6">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {"Record or Upload,AI Creates Magic,Pay & Download".split(",").map((step, idx) => (
            <Card
              key={idx}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
            >
              <h3 className="text-xl font-semibold mb-2">Step {idx + 1}</h3>
              <p className="opacity-90">{step}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-2xl mx-auto text-center mt-24 space-y-6">
        <h2 className="text-3xl font-bold">Simple Pricing</h2>
        <Card className="bg-white text-black p-8 rounded-2xl shadow-xl">
          <h3 className="text-4xl font-extrabold mb-2">$5 One-Time</h3>
          <p className="text-gray-600 mb-4">
            Pay once. Download your AI-enhanced voicemail instantly.
          </p>
          <a href="/create"><Button className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg font-semibold">Create My Voicemail</Button></a>
        </Card>
      </section>

      {/* Footer */}
      <footer className="text-center opacity-70 mt-24 mb-10 text-sm">
        © {new Date().getFullYear()} Voicemail Genie — All rights reserved.
      </footer>
    </div>
  );
}

// --- Tests (simple smoke test helpers) ---
// Exported helper to allow the test runner to confirm meta tags are set on the client.
export function _test_getClientMetaSnapshot() {
  if (typeof document === "undefined") return null;
  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || null,
    ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || null,
  };
}
