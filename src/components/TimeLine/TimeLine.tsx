// import the third-party stylesheets directly from your JS
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // needs additional webpack config!

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import { gapi } from "gapi-script";
import { useLog } from "../Context/LogContext";

interface CalendarProp {
  isGapiMounted: boolean;
}

const Calendar: React.FC<CalendarProp> = ({ isGapiMounted }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState([]);
  const { logList, logsCompleteLogsList } = useLog();
  const logEvents = logList.map((log) => {
    const completeLogs = logsCompleteLogsList.filter(
      (completeLog) => completeLog.logId === log.id
    );
    const events: {
      title: string;
      start: string | Date;
      end: string | Date;
      display: string;
      color: string;
    }[] = [];
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
    if (isGapiMounted) {
      listUpcomingEvents();
    }
  }, [isGapiMounted, isSignedIn]);

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, bootstrap5Plugin]}
        themeSystem="bootstrap5"
        initialView="timeGridWeek"
        nowIndicator={true}
        height={1300}
        titleFormat={{ year: "numeric", month: "2-digit", day: "2-digit" }}
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={[...googleCalendarEvents, ...logEvents.flat()]}
        views={{
          dayGridMonth: {
            titleFormat: { year: "numeric", month: "2-digit" },
          },
        }}
        locale="ja"
      />
    </>
  );
};

export default Calendar;
