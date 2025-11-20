import React from "react";

interface LandingPageProps {
  onLogin: () => void;
  authMessage?: string | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, authMessage }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-sky-500/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Katalyst <span className="text-slate-500 font-medium">Demo</span></span>
          </div>
          <button
            onClick={onLogin}
            className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/20 ring-1 ring-inset ring-white/10"
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/20 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Powered by Model Context Protocol
            </div>
            
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-transparent sm:text-7xl bg-clip-text bg-linear-to-b from-white via-white to-slate-400">
              Contextual Intelligence for your Calendar
            </h1>
            
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              An AI-powered internal tooling layer that connects to Google Calendar using MCP. 
              Experience seamless integration, smart bucketing, and contextual insights.
            </p>

            <div className="mt-10 flex items-center gap-x-6">
              <button
                onClick={onLogin}
                className="group relative inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-950 shadow-xl shadow-white/10 transition-all hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <svg className="h-5 w-5 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Connect with Google
              </button>
              <a href="#stack" className="text-sm font-semibold leading-6 text-white hover:text-indigo-300 transition-colors">
                View Tech Stack <span aria-hidden="true">→</span>
              </a>
            </div>

            {authMessage && (
              <div className="mt-8 rounded-lg bg-rose-500/10 px-4 py-2 text-sm text-rose-400 ring-1 ring-inset ring-rose-500/20">
                {authMessage}
              </div>
            )}
          </div>

          {/* Mock UI / Glass Card */}
          <div className="mt-16 flow-root sm:mt-24">
            <div className="relative rounded-xl bg-slate-900/50 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4 backdrop-blur-md">
              <div className="rounded-lg bg-slate-900 ring-1 ring-white/10 overflow-hidden shadow-2xl">
                <div className="flex items-center gap-4 border-b border-white/5 bg-white/5 px-6 py-4">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500/50" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="h-6 w-64 rounded-md bg-white/5" />
                </div>
                <div className="p-8 grid gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="h-8 w-32 rounded bg-white/10" />
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-4 rounded-lg border border-white/5 bg-white/5 p-4">
                          <div className="h-10 w-10 rounded-lg bg-indigo-500/20" />
                          <div className="space-y-2 flex-1">
                            <div className="h-4 w-3/4 rounded bg-white/10" />
                            <div className="h-3 w-1/2 rounded bg-white/5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 opacity-50">
                    <div className="h-8 w-32 rounded bg-white/10" />
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-4 rounded-lg border border-white/5 bg-white/5 p-4">
                          <div className="h-10 w-10 rounded-lg bg-slate-500/20" />
                          <div className="space-y-2 flex-1">
                            <div className="h-4 w-3/4 rounded bg-white/10" />
                            <div className="h-3 w-1/2 rounded bg-white/5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Tech Stack / Features */}
      <section id="stack" className="py-24 sm:py-32 border-t border-white/5 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">Engineering Approach</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built for Ambiguity & Execution
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              Designed to demonstrate ownership, technical breadth, and AI integration capabilities.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: 'Model Context Protocol',
                  description: 'Leveraging Composio to standardize calendar interactions via MCP, enabling scalable tool use for LLMs.',
                  icon: (
                    <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  ),
                },
                {
                  name: 'Contextual Intelligence',
                  description: 'Beyond simple CRUD. The system buckets events and prepares data for AI summarization and insight generation.',
                  icon: (
                    <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                },
                {
                  name: 'Modern Stack',
                  description: 'React, Tailwind v4, and Node.js. Deployed for speed and reliability with a focus on clean, reusable code.',
                  icon: (
                    <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  ),
                },
              ].map((feature) => (
                <div key={feature.name} className="flex flex-col bg-white/5 p-6 rounded-2xl ring-1 ring-white/10 hover:bg-white/10 transition-colors">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    {feature.icon}
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
