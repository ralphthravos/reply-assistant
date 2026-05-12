import './globals.css';

export const metadata = {
  title: 'Reply Assistant',
  description: 'AI-powered reply drafts for outreach campaigns',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <span className="font-semibold text-white tracking-tight">Reply Assistant</span>
          <nav className="flex gap-4 text-sm">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">Draft Reply</a>
            <a href="/knowledge" className="text-gray-300 hover:text-white transition-colors">Knowledge Base</a>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
