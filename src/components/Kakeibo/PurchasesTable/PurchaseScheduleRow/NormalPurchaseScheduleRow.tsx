import { TableCell, IconButton, TableRow } from "@mui/material";
import { memo, useCallback } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { InputPurchaseScheduleRowType } from "../../../../types";
import PaymentsIcon from "@mui/icons-material/Payments";

type PlainNormalPurchaseScheduleRowProps = {
  editFormData: InputPurchaseScheduleRowType;
  isSmall: boolean;
  handleEditClick: () => void;
  handleDeleteButton: () => void;
};

const PlainNormalPurchaseScheduleRow = memo(
  ({
    editFormData,
    isSmall,
    handleEditClick,
    handleDeleteButton,
  }: PlainNormalPurchaseScheduleRowProps): JSX.Element => (
    <TableRow key={editFormData.id}>
      <TableCell sx={{ paddingX: 0.5 }}>
        {editFormData.cycle +
          (editFormData.date ? editFormData.date + "日" : editFormData.day)}
      </TableCell>
      <TableCell sx={{ paddingX: 0.5 }}>{editFormData.title}</TableCell>
      <TableCell sx={{ paddingX: 0.5 }}>{editFormData.price + "円"}</TableCell>
      <TableCell sx={{ paddingX: 0.5 }}>{editFormData.category}</TableCell>
      <TableCell sx={{ paddingX: 0.5 }}>{editFormData.method.label}</TableCell>
      <TableCell sx={{ paddingX: 0.5 }}>
        <PaymentsIcon color={editFormData.income ? "success" : "error"} />
      </TableCell>
      <TableCell sx={{ paddingX: 0.5 }}>{editFormData.description}</TableCell>
      <TableCell padding="none" sx={{ display: "flex" }}>
        <>
          <IconButton
            onClick={handleEditClick}
            sx={{
              "&:hover": {
                color: "#1976d2",
              },
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
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      </TableCell>
    </TableRow>
  )
);

const NormalPurchaseScheduleRow = ({
  editFormData,
  isSmall,
  setIsEdit,
  setOpenDialog,
}: {
  editFormData: InputPurchaseScheduleRowType;
  isSmall: boolean;
  setIsEdit: (value: React.SetStateAction<boolean>) => void;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleEditClick = useCallback(() => {
    setIsEdit(true);
  }, [setIsEdit]);

  const handleDeleteButton = useCallback(() => {
    setOpenDialog(true);
  }, [setOpenDialog]);

  const plainProps = {
    editFormData,
    isSmall,
    handleEditClick,
    handleDeleteButton,
  };
  return <PlainNormalPurchaseScheduleRow {...plainProps} />;
};

export default NormalPurchaseScheduleRow;