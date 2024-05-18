import {
  Autocomplete,
  Box,
  Button,
  FormGroup,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import StyledCheckbox from "../../StyledCheckbox";
import { useState, useCallback } from "react";
import {
  addDocPurchaseSchedule,
  batchAddDocPurchase,
  db,
  dbNames,
} from "../../../firebase";
import { getAuth } from "firebase/auth";
import {
  InputPurchaseScheduleType,
  InputPurchaseType,
  WeekDay,
  defaultMethodList,
} from "../../../types";
import { addDays, addMonths, addYears, nextDay } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers";
import {
  isValidatedNum,
  numericProps,
} from "../../../utilities/purchaseUtilities";
import {
  DocumentData,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";
import { useMethod } from "../../Context/MethodContext";
import { getPayLaterDate } from "../../../utilities/dateUtilities";

const auth = getAuth();

const defaultNewPurchase: InputPurchaseScheduleType = {
  userId: "",
  title: "",
  cycle: "毎月",
  date: 1,
  day: "月曜日",
  category: "",
  method: defaultMethodList,
  price: 0,
  income: false,
  description: "",
  endDate: addYears(new Date(), 1),
};

const weekDays: Record<WeekDay, Day> = {
  日曜日: 0,
  月曜日: 1,
  火曜日: 2,
  水曜日: 3,
  木曜日: 4,
  金曜日: 5,
  土曜日: 6,
};

const weekDaysString: WeekDay[] = [
  "日曜日",
  "月曜日",
  "火曜日",
  "水曜日",
  "木曜日",
  "金曜日",
  "土曜日",
];

const PurchaseScheduleInput = () => {
  const { methodList } = useMethod();
  const [newPurchaseSchedule, setNewPurchaseSchedule] =
    useState<InputPurchaseScheduleType>(defaultNewPurchase);

  const handleNewPurchaseScheduleInput = useCallback(
    (name: string, value: any) => {
      if (name === "price" || name === "date") {
        const numValue = Number(value);
        if (isValidatedNum(value)) {
          if (name === "date" && numValue > 31) {
            alert("32以上入力できません。");
            return;
          }
          setNewPurchaseSchedule((prev) => ({ ...prev, [name]: numValue }));
          return;
        }
        return;
      }
      setNewPurchaseSchedule((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const listMonthlyDaysUntil = (dayOfMonth: number, endDate: Date) => {
    const today = new Date();
    let startMonth = today.getMonth();

    // 現在の日付が指定された日より後の場合、最初の日付を次の月に設定
    if (today.getDate() > dayOfMonth) {
      startMonth += 1;
    }

    // 指定された日と月から最初の日付を設定
    let currentDate = new Date(today.getFullYear(), startMonth, dayOfMonth);

    const dates = [];

    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addMonths(currentDate, 1);
    }
    return dates;
  };

  const listWeeklyDaysUntil = (weekDayName: WeekDay, endDate: Date): Date[] => {
    const today = new Date();
    const dayOfWeek = weekDays[weekDayName];

    // 今日の日付から次の指定曜日を求める
    let currentDate = nextDay(today, dayOfWeek);
    const dates = [];

    // 指定された終了日まで繰り返し
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays(currentDate, 7);
    }
    return dates;
  };

  const addPurchase = useCallback(
    (docRef: DocumentReference<DocumentData>) => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        let daysList: Date[] = [];
        if (newPurchaseSchedule.cycle === "毎月" && newPurchaseSchedule.date) {
          daysList = listMonthlyDaysUntil(
            newPurchaseSchedule.date,
            newPurchaseSchedule.endDate
          );
        }
        if (newPurchaseSchedule.cycle === "毎週" && newPurchaseSchedule.day) {
          daysList = listWeeklyDaysUntil(
            newPurchaseSchedule.day,
            newPurchaseSchedule.endDate
          );
        }
        const batchPurchaseList: InputPurchaseType[][] = daysList.map((day) => {
          const docId = doc(collection(db, dbNames.purchase)).id;
          const newPurchase = {
            ...newPurchaseSchedule,
            userId,
            parentScheduleId: docRef.id,
          };
          const createdPurchase: (InputPurchaseType & { id?: string })[] = [
            {
              ...newPurchase,
              id: docId,
              date: day,
              childPurchaseId: "",
            },
          ];
          if (newPurchaseSchedule.method.timing === "翌月") {
            createdPurchase.push({
              ...newPurchase,
              date: getPayLaterDate(day, newPurchaseSchedule.method.timingDate),
              childPurchaseId: docId,
            });
          }
          return createdPurchase;
        });
        batchAddDocPurchase(batchPurchaseList.flat());
      }
    },
    [newPurchaseSchedule]
  );

  const addPurchaseSchedule = useCallback(() => {
    if (!newPurchaseSchedule.title) {
      alert("品目名を入力してください");
      return;
    }
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      addDocPurchaseSchedule({ ...newPurchaseSchedule, userId }).then(
        (docRef) => addPurchase(docRef)
      );
      setNewPurchaseSchedule(defaultNewPurchase);
    }
  }, [addPurchase, newPurchaseSchedule]);

  return (
    <Box display="flex">
      <FormGroup row sx={{ gap: 1, mr: 1, width: "100%" }}>
        <TextField
          label="品目"
          value={newPurchaseSchedule.title}
          onChange={(e) =>
            handleNewPurchaseScheduleInput("title", e.target.value)
          }
        />
        <TextField
          label="金額"
          value={newPurchaseSchedule.price}
          onChange={(e) =>
            handleNewPurchaseScheduleInput("price", e.target.value)
          }
          inputProps={numericProps}
        />
        <Select
          value={newPurchaseSchedule.cycle}
          onChange={(e) =>
            handleNewPurchaseScheduleInput("cycle", e.target.value)
          }
        >
          <MenuItem value="毎月">毎月</MenuItem>
          <MenuItem value="毎週">毎週</MenuItem>
          <MenuItem value="毎日">毎日</MenuItem>
        </Select>
        {newPurchaseSchedule.cycle === "毎月" && (
          <TextField
            label="日付"
            value={newPurchaseSchedule.date}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">日</InputAdornment>
              ),
            }}
            inputProps={numericProps}
            sx={{ maxWidth: 150 }}
            onChange={(e) =>
              handleNewPurchaseScheduleInput("date", e.target.value)
            }
          />
        )}
        {newPurchaseSchedule.cycle === "毎週" && (
          <Select
            value={newPurchaseSchedule.day}
            onChange={(e) =>
              handleNewPurchaseScheduleInput("day", e.target.value)
            }
          >
            {weekDaysString.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        )}
        <TextField
          label="カテゴリー"
          value={newPurchaseSchedule.category}
          onChange={(e) =>
            handleNewPurchaseScheduleInput("category", e.target.value)
          }
        />
        <Autocomplete
          value={
            newPurchaseSchedule.method?.id ? newPurchaseSchedule.method : null
          }
          sx={{ minWidth: 150 }}
          options={methodList}
          onChange={(_e, v) => handleNewPurchaseScheduleInput("method", v)}
          renderInput={(params) => <TextField {...params} label="支払い方法" />}
        />
        <StyledCheckbox
          value={newPurchaseSchedule.income}
          handleCheckbox={() =>
            handleNewPurchaseScheduleInput(
              "income",
              !newPurchaseSchedule.income
            )
          }
        >
          収入
        </StyledCheckbox>
        <TextField
          label="備考"
          multiline
          value={newPurchaseSchedule.description}
          onChange={(e) =>
            handleNewPurchaseScheduleInput("description", e.target.value)
          }
        />
        <DatePicker
          label="期日"
          value={newPurchaseSchedule.endDate}
          sx={{ maxWidth: 150 }}
          onChange={(value) => handleNewPurchaseScheduleInput("endDate", value)}
        />
      </FormGroup>
      <Button variant="contained" onClick={addPurchaseSchedule}>
        追加
      </Button>
    </Box>
  );
};

export default PurchaseScheduleInput;