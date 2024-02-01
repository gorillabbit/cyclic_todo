import { Chip } from "@mui/material";

interface ChipWrapperProps {
  label: string;
}

const ChipWrapper: React.FC<ChipWrapperProps> = ({ label }) => {
  return <Chip label={label} sx={{ m: 0.2 }} size="small" />;
};

export default ChipWrapper;
