import React from "react";

interface EventListProps {
  title: string;
  events: any[];
  loading?: boolean;
  emptyMessage?: string;
}

const isAllDayEvent = (event: any) => {
  return Boolean(event?.start?.date) && !event?.start?.dateTime;
};

const parseDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatTimeWindow = (event: any) => {
  const allDay = isAllDayEvent(event);
  const startValue = event?.start?.dateTime || event?.start?.date;
  const endValue = event?.end?.dateTime || event?.end?.date;

  if (!startValue) {
    return "Time TBD";
  }

  if (allDay) {
    return new Date(startValue).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  const start = new Date(startValue);
  const end = endValue ? new Date(endValue) : null;

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    weekday: "short",
  });

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const dateLabel = dateFormatter.format(start);
  const startLabel = timeFormatter.format(start);
  const endLabel = end ? timeFormatter.format(end) : "";

  return endLabel ? `${dateLabel} · ${startLabel} - ${endLabel}` : `${dateLabel} · ${startLabel}`;
};

const formatDuration = (event: any) => {
  if (isAllDayEvent(event)) {
    return "All day";
  }

  const start = parseDate(event?.start?.dateTime);
  const end = parseDate(event?.end?.dateTime);

  if (!start || !end) {
    return null;
  }

  const diffMs = Math.max(end.getTime() - start.getTime(), 0);
  const totalMinutes = Math.round(diffMs / (60 * 1000));

  if (totalMinutes === 0) {
    return null;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours && minutes) {
    return `${hours}h ${minutes}m`;
  }
  if (hours) {
    return `${hours}h`;
  }
  return `${minutes}m`;
};

const extractDescription = (value?: string) => {
  if (!value) return "";
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

const ClockIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ITEMS_PER_PAGE = 5;

const EventList: React.FC<EventListProps> = ({
  title,
  events,
  loading = false,
  emptyMessage = "No events found.",
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [events]);

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEvents = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl transition-all hover:bg-white/10">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
          {loading && (
            <span className="flex items-center gap-2 text-xs font-medium text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full ring-1 ring-sky-500/20">
              <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-sky-400" />
              Syncing
            </span>
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg bg-white/5 p-1.5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-slate-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-xs font-medium text-slate-400 min-w-12 text-center">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg bg-white/5 p-1.5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-slate-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </header>

      {!loading && events.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-8 text-center">
          <div className="rounded-full bg-white/5 p-3 mb-3">
            <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-400">{emptyMessage}</p>
        </div>
      )}

      <div className="space-y-4">
        {currentEvents.map((event, index) => {
          const durationLabel = formatDuration(event);
          const descriptionText = extractDescription(event.description);
          const attendeeList = Array.isArray(event.attendees) ? event.attendees : [];

          return (
            <article
              key={`${event.id || event.summary || "event"}-${index}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/20 hover:shadow-md"
            >
              <div className="absolute top-0 left-0 h-full w-1 bg-linear-to-b from-sky-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-white truncate pr-4">
                    {event.summary || "Untitled event"}
                  </h4>
                  
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium text-slate-300">
                      <ClockIcon />
                      {formatTimeWindow(event)}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {durationLabel && (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/10">
                        <ClockIcon />
                        {durationLabel}
                      </span>
                    )}
                    {event.location && (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                        <LocationIcon />
                        <span className="truncate max-w-[150px]">{event.location}</span>
                      </span>
                    )}
                    {attendeeList.length > 0 && (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-400 ring-1 ring-indigo-500/20">
                        <UsersIcon />
                        {attendeeList.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {descriptionText && (
                <p className="mt-3 text-sm text-slate-400 line-clamp-2 pl-1 border-l-2 border-white/10">
                  {descriptionText}
                </p>
              )}

              {event.htmlLink && (
                <div className="mt-4 flex justify-end opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                  <a
                    href={event.htmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline"
                  >
                    Open in Calendar
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};export default EventList;
