import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const ToggleButtons = ({ isTask, setIsTask }) => {
  return (
    <ToggleButtonGroup
      value={isTask ? "タスク" : "ログ"}
      variant="contained"
      onClick={() => setIsTask((isTask) => !isTask)}
    >
      <ToggleButton value="タスク">タスク</ToggleButton>
      <ToggleButton value="ログ">ログ</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ToggleButtons;
