import React from "react";
import EventList from "./EventList";
import { GoogleUser } from "../api/auth.api";

export interface MeetingSummary {
  insights: string[];
  meetings: Array<{
    title: string;
    date: string;
    attendees: string[];
    keyDecisions: string[];
    nextSteps: string[];
  }>;
}

interface DashboardProps {
  user: GoogleUser;
  status: any;
  events: {
    upcoming: any[];
    past: any[];
  };
  loading: boolean;
  connecting: boolean;
  statusError: string | null;
  authMessage: string | null;
  onConnect: () => void;
  onLogout: () => void;
  onDismissAuthMessage: () => void;
  summary: MeetingSummary | null;
  summaryLoading: boolean;
  summaryError: string | null;
  onRefreshSummary: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  status,
  events,
  loading,
  connecting,
  statusError,
  authMessage,
  onConnect,
  onLogout,
  onDismissAuthMessage,
  summary,
  summaryLoading,
  summaryError,
  onRefreshSummary,
}) => {
  const hasPastEvents = events.past.length > 0;
  const summaryInsights = summary?.insights ?? [];
  const summaryMeetings = summary?.meetings ?? [];
  const hasSummaryContent = summaryInsights.length > 0 || summaryMeetings.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white font-sans relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-sky-500/20 blur-[120px]" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            {user.picture ? (
              <img 
                src={user.picture} 
                alt={user.name || "User"} 
                className="h-16 w-16 rounded-full border-2 border-white/10 shadow-lg shadow-indigo-500/20"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-indigo-500/20 flex items-center justify-center border-2 border-white/10 shadow-lg">
                <span className="text-2xl font-bold text-indigo-400">
                  {(user.name || user.email || "U").charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Welcome back, {user.name?.split(' ')[0] || 'Traveler'}
              </h1>
              <p className="text-slate-400 text-sm">
                {user.email}
              </p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="group flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 shadow-sm ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-white hover:ring-white/20"
          >
            <span>Sign out</span>
            <svg className="w-4 h-4 text-slate-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar / Status Column */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
            {/* Connection Status Card */}
            <div className="overflow-hidden rounded-3xl bg-white/5 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Calendar Sync</h2>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 ring-inset ${status?.connected ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' : 'bg-amber-500/10 text-amber-400 ring-amber-500/20'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${status?.connected ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                    {status?.connected ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  {status?.connected
                    ? "Your Google Calendar is connected. We're automatically syncing your latest trips and events."
                    : "Connect your Google Calendar to automatically import your upcoming trips and travel plans."}
                </p>

                <button
                  onClick={onConnect}
                  disabled={connecting}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all transform active:scale-95 ${
                    status?.connected 
                      ? 'bg-white/10 hover:bg-white/20 ring-1 ring-white/10' 
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                  } disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {connecting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Connecting...
                    </>
                  ) : status?.connected ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Sync Now
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                      </svg>
                      Connect Google Calendar
                    </>
                  )}
                </button>
                
                {statusError && (
                  <div className="mt-4 rounded-lg bg-rose-500/10 p-3 text-xs text-rose-400 ring-1 ring-rose-500/20">
                    {statusError}
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white/5 p-5 shadow-lg ring-1 ring-white/10 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 mb-3 ring-1 ring-sky-500/30">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-400">Upcoming</p>
                <p className="text-2xl font-bold text-white">{events.upcoming.length}</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-5 shadow-lg ring-1 ring-white/10 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 mb-3 ring-1 ring-indigo-500/30">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-400">Past Trips</p>
                <p className="text-2xl font-bold text-white">{events.past.length}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl bg-white/5 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">AI Meeting Highlights</h2>
                      <p className="text-xs text-slate-400">Summaries update from your past events.</p>
                    </div>
                  </div>
                  <button
                    onClick={onRefreshSummary}
                    disabled={summaryLoading || !hasPastEvents}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {summaryLoading ? (
                      <>
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Updating
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                      </>
                    )}
                  </button>
                </div>

                {summaryError && (
                  <div className="rounded-lg bg-rose-500/10 p-3 text-xs text-rose-300 ring-1 ring-rose-500/20">
                    {summaryError}
                  </div>
                )}

                {!summaryError && summaryLoading && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Drafting your recap...
                  </div>
                )}

                {!summaryLoading && !summaryError && hasSummaryContent && (
                  <div className="space-y-4">
                    {summaryInsights.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                          Highlights
                        </h3>
                        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300 marker:text-purple-300">
                          {summaryInsights.map((item, index) => (
                            <li key={`summary-insight-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {summaryMeetings.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Recent Meetings
                        </h3>
                        <div className="space-y-3">
                          {summaryMeetings.map((meeting, index) => (
                            <div
                              key={`meeting-summary-${index}`}
                              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"
                            >
                              <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <p className="font-semibold text-white">{meeting.title}</p>
                                {meeting.date && (
                                  <span className="text-xs font-medium text-slate-400">
                                    {meeting.date}
                                  </span>
                                )}
                              </div>

                              {meeting.attendees.length > 0 && (
                                <p className="mt-2 text-xs text-slate-400">
                                  Attendees: {meeting.attendees.join(", ")}
                                </p>
                              )}

                              {meeting.keyDecisions.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                                    Key Decisions
                                  </p>
                                  <ul className="list-disc space-y-1 pl-5 text-xs text-slate-300 marker:text-purple-300">
                                    {meeting.keyDecisions.map((decision, decisionIndex) => (
                                      <li key={`meeting-${index}-decision-${decisionIndex}`}>{decision}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {meeting.nextSteps.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                                    Next Steps
                                  </p>
                                  <ul className="list-disc space-y-1 pl-5 text-xs text-slate-300 marker:text-purple-300">
                                    {meeting.nextSteps.map((step, stepIndex) => (
                                      <li key={`meeting-${index}-next-${stepIndex}`}>{step}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!summaryLoading && !summaryError && !hasSummaryContent && (
                  <p className="text-sm text-slate-400">
                    {hasPastEvents
                      ? "Tap refresh to create a smart summary of your recent meetings."
                      : "Once you have past meetings on your calendar, we will craft highlights here."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            <EventList
              title="Upcoming Trips"
              events={events.upcoming}
              loading={loading}
              emptyMessage={status?.connected ? "No upcoming trips found. Time to plan one!" : "Connect your calendar to see your upcoming trips."}
            />
            
            <EventList
              title="Past Adventures"
              events={events.past}
              loading={loading}
              emptyMessage={status?.connected ? "No past trips found in the last 30 days." : "Connect your calendar to see your travel history."}
            />
          </div>
        </div>
      </div>

      {authMessage && (
        <div className="fixed bottom-6 right-6 max-w-sm rounded-xl bg-slate-900 p-4 shadow-2xl ring-1 ring-white/10 animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="shrink-0 text-amber-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-300">{authMessage}</p>
            <button onClick={onDismissAuthMessage} className="text-slate-500 hover:text-slate-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
