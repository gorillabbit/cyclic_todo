import { Search } from "@mui/icons-material";
import {
  Popover,
  TextField,
  InputAdornment,
  Skeleton,
  Box,
  Button,
} from "@mui/material";
import { useState } from "react";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFontAwesomeIconPack } from "../../hooks/useFontAwesomeIconPack";

interface FontAwesomeIconPickerProps {
  value: string;
  onChange: (name: string, value: string) => void;
}

const FontAwesomeIconPicker: React.FC<FontAwesomeIconPickerProps> = ({
  value,
  onChange,
}) => {
  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const iconPack = useFontAwesomeIconPack();

  if (!iconPack) {
    return <Skeleton variant="rectangular" width={210} height={40} />;
  }

  const iconsFiltered = iconPack.filter((icon) => {
    return icon.iconName.includes(searchText.toLowerCase());
  });

  return (
    <>
      <Button
        sx={{ color: "GrayText", borderColor: "GrayText" }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        variant="outlined"
      >
        {value ? <FontAwesomeIcon icon={["fas", value as IconName]} /> : "Icon"}
      </Button>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{ marginTop: 2 }}
      >
        <Box
          width={360}
          sx={{
            minHeight: "200px",
            maxHeight: "450px",
          }}
          m={2}
        >
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              placeholder="Search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              size="small"
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              variant="contained"
              color="error"
              onClick={() => onChange("icon", "")}
            >
              削除
            </Button>
          </Box>

          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            pt={1}
            gap={1}
          >
            {iconsFiltered.map((icon, index) => (
              <Button
                variant="outlined"
                sx={{ width: "10px", minWidth: 0 }}
                onClick={() => onChange("icon", icon.iconName)}
                key={icon.iconName + index}
              >
                <FontAwesomeIcon icon={icon} />
              </Button>
            ))}
          </Box>
        </Box>
      </Popover>
    </>
  );
};
export default FontAwesomeIconPicker;
