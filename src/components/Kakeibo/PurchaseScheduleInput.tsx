import {
  Box,
  Button,
  FormGroup,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import StyledCheckbox from "../StyledCheckbox";
import { useState } from "react";
import { addDocPurchaseSchedule, batchAddDocPurchase } from "../../firebase";
import { getAuth } from "firebase/auth";
import {
  InputPurchaseScheduleType,
  InputPurchaseType,
  WeekDay,
} from "../../types";
import { addDays, addMonths, addYears, nextDay } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers";
import { numericProps } from "../../utilities/purchaseUtilities";

const auth = getAuth();

const PurchaseScheduleInput = () => {
  const defaultNewPurchase: InputPurchaseScheduleType = {
    userId: "",
    title: "",
    cycle: "毎月",
    date: 1,
    day: "月曜日",
    category: "",
    method: "",
    price: 0,
    income: false,
    description: "",
    endDate: addYears(new Date(), 1),
  };

  const [newPurchaseSchedule, setNewPurchaseSchedule] =
    useState<InputPurchaseScheduleType>(defaultNewPurchase);

  const handleNewPurchaseScheduleInput = (name: string, value: any) => {
    if (name === "price" || name === "date") {
      const numValue = Number(value);
      if (Number.isNaN(numValue) || numValue < 0) {
        alert("0未満は入力できません。");
        return;
      }
      if (name === "date" && numValue > 31) {
        alert("32以上入力できません。");
        return;
      }
      setNewPurchaseSchedule((prev) => ({ ...prev, [name]: numValue }));
      return;
    }
    setNewPurchaseSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const addPurchaseSchedule = () => {
    if (!newPurchaseSchedule.title) {
      alert("品目名を入力してください");
      return;
    }
    if (newPurchaseSchedule && auth.currentUser) {
      const userId = auth.currentUser.uid;
      addDocPurchaseSchedule({ ...newPurchaseSchedule, userId });
      addPurchase();
      setNewPurchaseSchedule(defaultNewPurchase);
    }
  };

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

  // 曜日と数値のマッピング
  const weekDays: Record<WeekDay, Day> = {
    日曜日: 0,
    月曜日: 1,
    火曜日: 2,
    水曜日: 3,
    木曜日: 4,
    金曜日: 5,
    土曜日: 6,
  };

  // 曜日名のリスト
  const weekDaysString: WeekDay[] = [
    "日曜日",
    "月曜日",
    "火曜日",
    "水曜日",
    "木曜日",
    "金曜日",
    "土曜日",
  ];

  const listWeeklyDaysUntil = (weekDayName: WeekDay, endDate: Date): Date[] => {
    const today = new Date();
    const dayOfWeek = weekDays[weekDayName];

    // 今日の日付から次の指定曜日を求める
    let currentDate = nextDay(today, dayOfWeek);

    const dates = [];

    // 指定された終了日まで繰り返し
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays(currentDate, 7); // 次の週の同じ曜日に進む
    }

    return dates;
  };

  const addPurchase = () => {
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
      const batchPurchaseList: InputPurchaseType[] = daysList.map((day) => {
        return {
          userId,
          title: newPurchaseSchedule.title,
          date: day,
          category: newPurchaseSchedule.category,
          method: newPurchaseSchedule.method,
          price: newPurchaseSchedule.price,
          income: newPurchaseSchedule.income,
          description: newPurchaseSchedule.description,
        };
      });
      batchAddDocPurchase(batchPurchaseList);
    }
  };

  return (
    <Box display="flex" m={2}>
      <FormGroup row={true} sx={{ gap: 1, m: 1, width: "100%" }}>
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
        <TextField
          label="支払い方法"
          value={newPurchaseSchedule.method}
          onChange={(e) =>
            handleNewPurchaseScheduleInput("method", e.target.value)
          }
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
      <Button sx={{ my: 1 }} variant="contained" onClick={addPurchaseSchedule}>
        追加
      </Button>
    </Box>
  );
};

export default PurchaseScheduleInput;
