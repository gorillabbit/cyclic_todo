import { Button, Checkbox } from "@mui/material";

interface StyledCheckboxProps {
  value: boolean;
  handleCheckbox: () => void;
  children: string;
}

const StyledCheckbox: React.FC<StyledCheckboxProps> = ({
  value,
  handleCheckbox,
  children,
}) => {
  return (
    <Button
      sx={{ color: "GrayText", borderColor: "GrayText" }}
      variant="outlined"
      onClick={handleCheckbox}
    >
      <Checkbox checked={value} />
      {children}
    </Button>
  );
};

export default StyledCheckbox;
