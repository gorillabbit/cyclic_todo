import { IconButton, Button, Box } from "@mui/material";
import { memo, useCallback } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type PlainPurchaseRowButtonsProps = {
  handleEditClick: () => void;
  handleDeleteButton: () => void;
  handleEditPriceButtonClick: () => void;
  isUncertain: boolean | undefined;
};

const PlainPurchaseRowButtons = memo(
  ({
    handleEditClick,
    handleDeleteButton,
    handleEditPriceButtonClick,
    isUncertain,
  }: PlainPurchaseRowButtonsProps) => (
    <Box display="flex">
      <IconButton
        onClick={handleEditClick}
        sx={{
          "&:hover": {
            color: "#1976d2",
          },
          p: 0.5,
        }}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        onClick={handleDeleteButton}
        sx={{
          "&:hover": {
            color: "#d32f2f",
          },
          p: 0.5,
        }}
      >
        <DeleteIcon />
      </IconButton>
      {isUncertain && (
        <Button sx={{ p: 0.5 }} onClick={handleEditPriceButtonClick}>
          金額確定
        </Button>
      )}
    </Box>
  )
);

const PurchaseRowButtons = ({
  setIsEdit,
  setOpenDialog,
  setIsEditPrice,
  isUncertain,
}: {
  setIsEdit: (value: React.SetStateAction<boolean>) => void;
  setIsEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  isUncertain: boolean | undefined;
}) => {
  const handleEditClick = useCallback(() => {
    setIsEdit(true);
  }, [setIsEdit]);

  const handleDeleteButton = useCallback(() => {
    setOpenDialog(true);
  }, [setOpenDialog]);

  const handleEditPriceButtonClick = useCallback(
    () => setIsEditPrice(true),
    [setIsEditPrice]
  );
  const plainProps = {
    handleEditClick,
    handleDeleteButton,
    isUncertain,
    handleEditPriceButtonClick,
  };
  return <PlainPurchaseRowButtons {...plainProps} />;
};

export default PurchaseRowButtons;
