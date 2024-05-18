import { TableCell, IconButton, Chip, TableRow } from "@mui/material";
import { memo, useCallback } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { InputPurchaseRowType } from "../../../../types";
import PaymentsIcon from "@mui/icons-material/Payments";

type PlainNormalPurchaseRowProps = {
  isGroup: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  editFormData: InputPurchaseRowType;
  isSmall: boolean;
  handleEditClick: () => void;
  handleDeleteButton: () => void;
};

const PlainNormalPurchaseRow = memo(
  ({
    isGroup,
    setOpen,
    open,
    editFormData,
    isSmall,
    handleEditClick,
    handleDeleteButton,
  }: PlainNormalPurchaseRowProps): JSX.Element => (
    <>
      <TableRow sx={{ pb: 0.5 }}>
        <TableCell sx={{ paddingX: 0.5 }}>
          {isGroup && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell sx={{ paddingX: 0.5 }}>
          {editFormData.date.toLocaleString().split(" ")[0]}
        </TableCell>
        <TableCell sx={{ paddingX: 0.5 }}>
          {isGroup
            ? `${editFormData.method.label} 引き落し`
            : editFormData.title}
        </TableCell>
        <TableCell sx={{ paddingX: 0.5 }}>
          {editFormData.price + "円"}
          {editFormData.method.timing === "翌月" &&
            editFormData.childPurchaseId && <Chip label="翌月" />}
        </TableCell>
        {!isSmall && (
          <>
            <TableCell sx={{ paddingX: 0.5 }}>
              {editFormData.category}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {editFormData.method.label}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              <PaymentsIcon color={editFormData.income ? "success" : "error"} />
            </TableCell>
            <TableCell>{editFormData.description}</TableCell>
            <TableCell sx={{ display: "flex", paddingX: 0.5 }}>
              {!isGroup && (
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
              )}
            </TableCell>
          </>
        )}
      </TableRow>
      {isSmall && (
        <TableRow>
          <TableCell sx={{ paddingX: 0.5 }} />
          <TableCell sx={{ paddingX: 0.5 }}>{editFormData.category}</TableCell>
          <TableCell sx={{ paddingX: 0.5 }}>
            {editFormData.method.label}
          </TableCell>
          <TableCell sx={{ paddingX: 0.5 }}>
            <PaymentsIcon color={editFormData.income ? "success" : "error"} />
          </TableCell>
          <TableCell sx={{ display: "flex", paddingX: 0.5 }}>
            {!isGroup && (
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
            )}
          </TableCell>
        </TableRow>
      )}
    </>
  )
);

const NormalPurchaseRow = ({
  isGroup,
  setOpen,
  open,
  editFormData,
  isSmall,
  setIsEdit,
  setOpenDialog,
}: {
  isGroup: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  editFormData: InputPurchaseRowType;
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
    isGroup,
    setOpen,
    open,
    editFormData,
    isSmall,
    handleEditClick,
    handleDeleteButton,
  };
  return <PlainNormalPurchaseRow {...plainProps} />;
};

export default NormalPurchaseRow;
