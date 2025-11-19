import { useState } from 'react';
import type { CalendarEvent } from '../types/calendar.types';
import { calendarApi } from '../api/calendar.api';
import type { MeetingSummary } from '../types/calendar.types';

interface MeetingCardProps {
  meeting: CalendarEvent;
  isPast?: boolean;
}

export const MeetingCard = ({ meeting, isPast = false }: MeetingCardProps) => {
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const handleGenerateSummary = async () => {
    if (summary) {
      setShowSummary(!showSummary);
      return;
    }

    setLoadingSummary(true);
    try {
      const response = await calendarApi.getMeetingSummary(
        meeting.title,
        meeting.description || '',
        meeting.attendees,
        formatDuration(meeting.duration)
      );
      if (response.success && response.data) {
        setSummary(response.data);
        setShowSummary(true);
      }
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{meeting.title}</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(meeting.startTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatDuration(meeting.duration)}</span>
            </div>
          </div>
        </div>
        {isPast && (
          <button
            onClick={handleGenerateSummary}
            disabled={loadingSummary}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingSummary ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {showSummary ? 'Hide Summary' : 'AI Summary'}
              </span>
            )}
          </button>
        )}
      </div>

      {meeting.description && (
        <p className="text-gray-600 mb-4 text-sm">{meeting.description}</p>
      )}

      {meeting.attendees.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Attendees ({meeting.attendees.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {meeting.attendees.slice(0, 5).map((attendee, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-purple-50 to-blue-50 text-gray-700 rounded-lg text-xs font-medium border border-purple-100"
              >
                {attendee}
              </span>
            ))}
            {meeting.attendees.length > 5 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                +{meeting.attendees.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {showSummary && summary && (
        <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Summary
          </h4>
          <p className="text-gray-700 mb-3 text-sm">{summary.summary}</p>
          
          {summary.keyPoints.length > 0 && (
            <div className="mb-3">
              <h5 className="text-xs font-semibold text-gray-700 mb-2">Key Points:</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {summary.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {summary.actionItems.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-gray-700 mb-2">Action Items:</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {summary.actionItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

