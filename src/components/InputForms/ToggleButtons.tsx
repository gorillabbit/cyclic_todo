import { ToggleButton, ToggleButtonGroup } from "@mui/material";

interface ToggleButtonsProps {
  isTask: boolean;
  setIsTask: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleButtons: React.FC<ToggleButtonsProps> = ({ isTask, setIsTask }) => {
  return (
    <ToggleButtonGroup
      value={isTask ? "タスク" : "ログ"}
      onChange={() => setIsTask(!isTask)}
    >
      <ToggleButton value="タスク">タスク</ToggleButton>
      <ToggleButton value="ログ">ログ</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ToggleButtons;
