"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";

type AppState = "idle" | "uploading" | "processing" | "done" | "error";

interface ResultData {
  originalUrl: string;
  resultUrl: string;
  originalName: string;
}

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<ResultData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    // 客户端校验
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setErrorMsg("Unsupported file type. Please upload JPG, PNG, or WebP.");
      setState("error");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setErrorMsg("File is too large. Maximum size is 12MB.");
      setState("error");
      return;
    }

    const originalUrl = URL.createObjectURL(file);
    setState("processing");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("image_file", file);

      const res = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unknown error" }));
        const messages: Record<string, string> = {
          MISSING_API_KEY: "Service configuration error. Please try again later.",
          FILE_TOO_LARGE: "File is too large. Maximum size is 12MB.",
          INVALID_FILE: "Invalid file format. Please upload a JPG, PNG, or WebP image.",
          RATE_LIMIT: "API rate limit reached. Please try again later.",
          API_ERROR: "Background removal failed. Please try a different image.",
        };
        throw new Error(messages[data.code] || data.error || "Processing failed.");
      }

      const blob = await res.blob();
      const resultUrl = URL.createObjectURL(blob);

      setResult({
        originalUrl,
        resultUrl,
        originalName: file.name.replace(/\.[^.]+$/, ""),
      });
      setState("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.resultUrl;
    a.download = `${result.originalName}-removed-bg.png`;
    a.click();
  };

  const handleReset = () => {
    if (result) {
      URL.revokeObjectURL(result.originalUrl);
      URL.revokeObjectURL(result.resultUrl);
    }
    setResult(null);
    setState("idle");
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900">BgRemover</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Remove Image Background{" "}
              <span className="text-blue-600">for Free</span>
            </h1>
            <p className="text-lg text-gray-500 mb-10">
              AI-powered · Instant · No signup required · Your images are never stored
            </p>

            {/* Upload / Result Area */}
            {state === "idle" || state === "error" ? (
              <div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`
                    border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all
                    ${isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop your image here, or{" "}
                        <span className="text-blue-600">browse</span>
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Supports JPG, PNG, WebP · Max 12MB
                      </p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors">
                      Upload Image
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {state === "error" && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    ⚠️ {errorMsg}
                  </div>
                )}
              </div>
            ) : state === "processing" ? (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-16 bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-600 font-medium">Removing background...</p>
                  <p className="text-sm text-gray-400">This usually takes 2-5 seconds</p>
                </div>
              </div>
            ) : (
              /* Result View */
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Original */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 text-left">Original</p>
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={result!.originalUrl}
                        alt="Original"
                        className="w-full h-64 object-contain"
                      />
                    </div>
                  </div>
                  {/* Result */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 text-left">Background Removed</p>
                    <div
                      className="rounded-xl overflow-hidden border border-gray-200"
                      style={{
                        backgroundImage:
                          "linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)",
                        backgroundSize: "20px 20px",
                        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={result!.resultUrl}
                        alt="Background Removed"
                        className="w-full h-64 object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleDownload}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PNG
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-8 py-3 rounded-xl font-medium transition-colors"
                  >
                    Try Another Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
              Why use BgRemover?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  icon: "🆓",
                  title: "100% Free",
                  desc: "No hidden fees, no subscriptions, no credit card required.",
                },
                {
                  icon: "🔒",
                  title: "No Storage",
                  desc: "Your images are processed in memory and never saved to any server.",
                },
                {
                  icon: "⚡",
                  title: "Instant Results",
                  desc: "AI-powered processing delivers results in just 2-5 seconds.",
                },
                {
                  icon: "✨",
                  title: "High Quality",
                  desc: "Precise AI detection handles hair, fur, complex edges and more.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100"
                >
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} BgRemover. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
