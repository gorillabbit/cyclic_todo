import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { gapi } from "gapi-script";
import { useLog } from "../Context/LogContext";

const Calendar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState([]);
  const { logList, logsCompleteLogsList } = useLog();
  const logEvents = logList.map((log) => {
    const completeLogs = logsCompleteLogsList.filter(
      (completeLog) => completeLog.logId === log.id
    );
    const events = [];
    while (completeLogs.length > 0) {
      events.push({
        title: log.text,
        start: completeLogs.pop()?.timestamp?.toDate() ?? "",
        end: log.duration ? completeLogs.pop()?.timestamp?.toDate() ?? "" : "",
        display: "list-item",
        color: "#257e4a",
      });
    }
    return events;
  });

  const listUpcomingEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: "startTime",
      })
      .then((response: { result: { items: any } }) => {
        const resultEvents = response.result.items.map((item: any) => {
          return {
            title: item.summary,
            start: item.start.dateTime ?? item.start.date,
            end: item.end.dateTime ?? item.end.date,
          };
        });
        setGoogleCalendarEvents(resultEvents);
      });
  };

  useEffect(() => {
    gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn: boolean) => {
      setIsSignedIn(isSignedIn);
    });
    listUpcomingEvents();
  }, [isSignedIn]);

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,dayGridWeek,timeGridDay",
        }}
        events={[...googleCalendarEvents, ...logEvents.flat()]}
        locale="ja"
      />
    </>
  );
};

export default Calendar;
