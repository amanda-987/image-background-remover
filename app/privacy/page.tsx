import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - BgRemover",
  description: "Privacy policy for BgRemover image background removal tool.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900">BgRemover</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Image Processing</h2>
            <p>
              <strong>We do not store your images.</strong> When you upload an image, it is processed entirely in memory. Your image is sent to the remove.bg API for background removal and the result is returned directly to you. No copy of your original image or the processed result is saved on our servers at any point.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Third-Party Services</h2>
            <p>
              We use the <a href="https://www.remove.bg" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">remove.bg API</a> to process images. Your image is transmitted to remove.bg&apos;s servers for processing. Please review <a href="https://www.remove.bg/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">remove.bg&apos;s privacy policy</a> to understand how they handle image data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Cookies & Tracking</h2>
            <p>
              We do not use tracking cookies or analytics scripts. We do not collect personal information about our visitors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Retention</h2>
            <p>
              Since we do not store any images or personal data, there is nothing to retain or delete. All processing is ephemeral and discarded immediately after your download.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Contact</h2>
            <p>
              If you have any questions about this privacy policy, please reach out via our GitHub repository.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to BgRemover
          </Link>
        </div>
      </main>
    </div>
  );
}
