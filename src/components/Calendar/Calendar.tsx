import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // needs additional webpack config!

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { gapi } from "gapi-script";
import { useLog } from "../Context/LogContext";
import { useWindowSize } from "../../hooks/useWindowSize";
import EventContent from "./EventContent";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import { useTask } from "../Context/TaskContext";
import { parse } from "date-fns";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import TaskInputForm from "../InputForms/TaskInputForm";
import Task from "../Task/Task";
import Log from "../Log/Log";

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
        extendedProps: { source: "logList", id: log.id },
      });
    }
    return events;
  });

  const { taskList } = useTask();
  const taskEvents = taskList.map((task) => {
    return [
      {
        title: task.text + " 期日",
        start: task.hasDue
          ? parse(
              (task.dueDate as string) + (task.dueTime as string),
              "yyyy年MM月dd日HH時mm分",
              new Date()
            )
          : "",
        color: "#c43b31",
        allDay: task.hasDue && !task.hasDueTime,
        extendedProps: { source: "taskList", id: task.id },
      },
      {
        title: task.text + " 完了",
        start: task.completed ? task.toggleCompletionTimestamp?.toDate() : "",
        color: "#c43b31",
        extendedProps: { source: "taskList", id: task.id },
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
            extendedProps: { source: "googleCalendar" },
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

  const [openInputDialog, setOpenInputDialog] = useState(false); // ダイアログの開閉状態
  const [selectedDate, setSelectedDate] = useState(null); // 選択された日付

  // カレンダーの日付がクリックされたときの処理
  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date); // 選択された日付を設定
    setOpenInputDialog(true); // ダイアログを開く
  };

  // ダイアログを閉じる処理
  const handleClose = () => {
    setOpenInputDialog(false);
  };

  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [clickedEvent, setClickedEvent] = useState({ source: "", id: "" });
  const handleEventClick = (arg: any) => {
    if (arg.event._def.extendedProps.source !== "googleCalendar") {
      setClickedEvent({
        source: arg.event._def.extendedProps.source,
        id: arg.event._def.extendedProps.id,
      });
      setOpenEventDialog(true);
    }
  };
  const handleCloseEventDialog = () => {
    setOpenEventDialog(false);
  };

  return (
    <>
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          bootstrap5Plugin,
          interactionPlugin,
        ]}
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
        dateClick={(arg) => handleDateClick(arg)}
        eventClick={(arg) => handleEventClick(arg)}
      />
      <Dialog open={openInputDialog} onClose={handleClose}>
        <DialogTitle>タスク追加</DialogTitle>
        <DialogContent>
          {selectedDate && (
            <TaskInputForm
              date={selectedDate}
              openDialog={true}
              buttonAction={handleClose}
            />
          )}
          <Button onClick={handleClose}>閉じる</Button>
        </DialogContent>
      </Dialog>
      <Dialog open={openEventDialog} onClose={handleCloseEventDialog}>
        <DialogContent>
          {clickedEvent.source === "taskList" && (
            <Task
              task={taskList.filter((task) => task.id === clickedEvent.id)[0]}
            ></Task>
          )}
          {clickedEvent.source === "logList" && (
            <Log
              log={logList.filter((log) => log.id === clickedEvent.id)[0]}
              logsCompleteLogs={logsCompleteLogsList}
              openDialog={true}
            ></Log>
          )}

          <Button onClick={handleCloseEventDialog}>閉じる</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Calendar;
