import { IconButton, TableRow, Chip } from "@mui/material";
import { memo, useCallback } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { InputPurchaseScheduleRowType } from "../../../../types";
import PaymentsIcon from "@mui/icons-material/Payments";
import TableCellWrapper from "../../TableCellWrapper";

type PlainNormalPurchaseScheduleRowProps = {
  editFormData: InputPurchaseScheduleRowType;
  handleEditClick: () => void;
  handleDeleteButton: () => void;
};

const PlainNormalPurchaseScheduleRow = memo(
  ({
    editFormData,
    handleEditClick,
    handleDeleteButton,
  }: PlainNormalPurchaseScheduleRowProps): JSX.Element => (
    <TableRow key={editFormData.id}>
      <TableCellWrapper
        label={
          editFormData.cycle +
          (editFormData.date ? editFormData.date + "日" : editFormData.day)
        }
      />
      <TableCellWrapper
        label={editFormData.endDate.toLocaleString().split(" ")[0]}
      />
      <TableCellWrapper label={editFormData.title} />
      <TableCellWrapper label={editFormData.price + "円"} />
      <TableCellWrapper label={editFormData.category} />
      <TableCellWrapper label={editFormData.method.label} />
      <TableCellWrapper>
        <PaymentsIcon color={editFormData.income ? "success" : "error"} />
      </TableCellWrapper>
      <TableCellWrapper>
        {editFormData.isUncertain && <Chip label="未確定" />}
      </TableCellWrapper>
      <TableCellWrapper label={editFormData.description} />
      <TableCellWrapper>
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
      </TableCellWrapper>
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
