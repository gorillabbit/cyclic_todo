import { useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import PurchaseInput from "./PurchaseInput";
import PurchaseScheduleInput from "./PurchaseScheduleInput";
import TransferInput from "./TransferInput";

const InputForms = () => {
  const [isSchedule, setIsSchedule] = useState<string>("記録");
  //愚直に三項演算子で条件分岐すると、コンポーネントが再レンダリングされて入力内容が保存されない
  return (
    <>
      <ToggleButtonGroup
        value={isSchedule}
        exclusive
        onChange={(_e, v) => setIsSchedule(v)}
        sx={{ my: 1 }}
      >
        <ToggleButton value="記録">記録</ToggleButton>
        <ToggleButton value="予定">予定</ToggleButton>
        <ToggleButton value="送金">送金</ToggleButton>
      </ToggleButtonGroup>
      <Box display={isSchedule === "記録" ? "block" : "none"}>
        <PurchaseInput />
      </Box>
      <Box display={isSchedule === "予定" ? "block" : "none"}>
        <PurchaseScheduleInput />
      </Box>
      <Box display={isSchedule === "送金" ? "block" : "none"}>
        <TransferInput />
      </Box>
    </>
  );
};

export default InputForms;
