import { Chip } from '@mui/material';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';

interface ChipWrapperProps {
    label: string;
    isSelected: boolean;
    onClick?: () => void;
}

const ChipWrapper: React.FC<ChipWrapperProps> = ({ label, isSelected, onClick }) => {
    return (
        <Chip
            label={label}
            sx={{ m: 0.2 }}
            size="small"
            icon={isSelected ? <PushPinRoundedIcon /> : <PushPinOutlinedIcon />}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
        />
    );
};

export default ChipWrapper;
