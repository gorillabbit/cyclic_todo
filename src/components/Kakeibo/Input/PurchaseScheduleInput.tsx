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
import { addDocPurchaseSchedule } from "../../../firebase";
import { getAuth } from "firebase/auth";
import { InputPurchaseScheduleType, defaultMethodList } from "../../../types";
import { addYears } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers";
import {
  addScheduledPurchase,
  isValidatedNum,
  numericProps,
  weekDaysString,
} from "../../../utilities/purchaseUtilities";
import { useMethod } from "../../Context/MethodContext";

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

  const addPurchaseSchedule = useCallback(() => {
    if (!newPurchaseSchedule.title) {
      alert("品目名を入力してください");
      return;
    }
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      addDocPurchaseSchedule({ ...newPurchaseSchedule, userId }).then(
        (docRef) => addScheduledPurchase(docRef.id, newPurchaseSchedule)
      );
      setNewPurchaseSchedule(defaultNewPurchase);
    }
  }, [newPurchaseSchedule]);

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
