import { useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import PurchaseInput from "./PurchaseInput";
import PurchaseScheduleInput from "./PurchaseScheduleInput";

const InputForms = () => {
  const [isSchedule, setIsSchedule] = useState<boolean>(false);
  //愚直に三項演算子で条件分岐すると、コンポーネントが再レンダリングされて入力内容が保存されない
  return (
    <Box m={2}>
      <ToggleButtonGroup
        value={isSchedule ? "予定" : "記録"}
        onChange={() => setIsSchedule(!isSchedule)}
      >
        <ToggleButton value="記録">記録</ToggleButton>
        <ToggleButton value="予定">予定</ToggleButton>
      </ToggleButtonGroup>
      <Box display={isSchedule ? "none" : "block"}>
        <PurchaseInput />
      </Box>
      <Box display={isSchedule ? "block" : "none"}>
        <PurchaseScheduleInput />
      </Box>
    </Box>
  );
};

export default InputForms;
