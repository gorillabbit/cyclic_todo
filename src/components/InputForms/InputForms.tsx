import React, { useState } from "react";
import TaskInputForm from "./TaskInputForm";
import LogInputForm from "./LogInputForm";
import ToggleButtons from "./ToggleButtons";
import { Box } from "@mui/material";
import AccountShareButton from "./AccountShareButton";

const InputForms = () => {
  const [isTask, setIsTask] = useState<boolean>(true);
  //愚直に三項演算子で条件分岐すると、コンポーネントが再レンダリングされて入力内容が保存されない
  return (
    <Box m={2}>
      <ToggleButtons isTask={isTask} setIsTask={setIsTask} />
      <AccountShareButton />
      <Box display={isTask ? "block" : "none"}>
        <TaskInputForm />
      </Box>
      <Box display={isTask ? "none" : "block"}>
        <LogInputForm />
      </Box>
    </Box>
  );
};

export default InputForms;
