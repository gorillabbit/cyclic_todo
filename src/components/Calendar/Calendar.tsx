import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // needs additional webpack config!

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { gapi } from "gapi-script";
import { useLog } from "../Context/LogContext";
import { useWindowSize } from "../../hooks/useWindowSize";
import EventContent from "./EventContent";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import { useTask } from "../Context/TaskContext";
import { parse } from "date-fns";

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
    const events: any[] = [];
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

  const { taskList } = useTask();
  const taskEvents = taskList.map((task) => {
    return [
      {
        title: task.text + " 期日",
        start: parse(
          (task.dueDate as string) + (task.dueTime as string),
          "yyyy年MM月dd日HH時mm分",
          new Date()
        ),
        color: "#c43b31",
      },
      {
        title: task.text + " 完了",
        start: task.completed ? task.toggleCompletionTimestamp?.toDate() : "",
        color: "#c43b31",
      },
    ];
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

  const { width } = useWindowSize();
  const isSmallScreen = width < 768; // 768px以下を小さい画面と定義

  const [calendarView, setCalendarView] = useState("");

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, bootstrap5Plugin]}
        themeSystem="bootstrap5"
        initialView="week"
        nowIndicator={true}
        height={1300}
        titleFormat={{ year: "numeric", month: "2-digit", day: "2-digit" }}
        headerToolbar={{
          left: "prev,next",
          center: isSmallScreen ? "" : "title",
          right: "dayGridMonth,week,timeGridDay",
        }}
        events={[
          ...googleCalendarEvents,
          ...logEvents.flat(),
          ...taskEvents.flat(),
        ]}
        {...(isSmallScreen && calendarView === "dayGridMonth"
          ? { eventContent: EventContent }
          : {})}
        viewDidMount={(e) => setCalendarView(e.view.type)}
        views={{
          dayGridMonth: {
            titleFormat: { year: "numeric", month: "2-digit" },
          },
          week: { type: "timeGrid", duration: { days: isSmallScreen ? 4 : 7 } },
        }}
        locale="ja"
      />
    </>
  );
};

export default Calendar;
