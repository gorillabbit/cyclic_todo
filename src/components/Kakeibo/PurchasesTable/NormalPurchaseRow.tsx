import { TableCell, IconButton, Chip, TableRow } from "@mui/material";
import { memo, useCallback } from "react";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import { InputPurchaseRowType } from "../../../types";

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
  (props: PlainNormalPurchaseRowProps): JSX.Element => (
    <>
      {props.isSmall ? (
        <>
          <TableRow sx={{ pb: 0.5 }}>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.isGroup && (
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => props.setOpen(!props.open)}
                >
                  {props.open ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>
              )}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.editFormData.date.toLocaleString().split(" ")[0]}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.isGroup
                ? props.editFormData.method.label + " 引き落し"
                : props.editFormData.title}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.editFormData.price + "円"}
              {props.editFormData.method.timing === "翌月" &&
                props.editFormData.childPurchaseId && <Chip label="翌月" />}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ paddingX: 0.5 }} />
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.editFormData.category}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.editFormData.method.label}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.editFormData.income ? "収入" : "支出"}
            </TableCell>
            {!props.isSmall && (
              <TableCell>{props.editFormData.description}</TableCell>
            )}
            <TableCell padding="none" sx={{ display: "flex" }}>
              {!props.isGroup && (
                <>
                  <IconButton
                    onClick={props.handleEditClick}
                    sx={{
                      "&:hover": {
                        color: "#1976d2", // Color on hover
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={props.handleDeleteButton}
                    sx={{
                      "&:hover": {
                        color: "#d32f2f", // Color on hover
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </TableCell>
          </TableRow>
        </>
      ) : (
        <TableRow>
          <TableCell sx={{ paddingX: 0.5 }}>
            {props.isGroup && (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => props.setOpen(!props.open)}
              >
                {props.open ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            )}
          </TableCell>
          <TableCell sx={{ paddingX: 0.5 }}>
            {props.editFormData.date.toLocaleString().split(" ")[0]}
          </TableCell>
          <TableCell sx={{ paddingX: 0.5 }}>
            {props.isGroup
              ? props.editFormData.method.label + " 引き落し"
              : props.editFormData.title}
          </TableCell>
          <TableCell sx={{ paddingX: 0.5 }}>
            {props.editFormData.price + "円"}
            {props.editFormData.method.timing === "翌月" &&
              props.editFormData.childPurchaseId && <Chip label="翌月" />}
          </TableCell>
          <TableCell sx={{ paddingX: 0.5 }}>
            {props.editFormData.category}
          </TableCell>
          <TableCell sx={{ paddingX: 0.5 }}>
            {props.editFormData.method.label}
          </TableCell>
          <TableCell sx={{ paddingX: 0.5 }}>
            {props.editFormData.income ? "収入" : "支出"}
          </TableCell>
          {!props.isSmall && (
            <TableCell>{props.editFormData.description}</TableCell>
          )}
          <TableCell padding="none">
            {!props.isGroup && (
              <IconButton
                onClick={props.handleEditClick}
                sx={{
                  "&:hover": {
                    color: "#1976d2", // Color on hover
                  },
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </TableCell>
          <TableCell padding="none">
            {!props.isGroup && (
              <IconButton
                onClick={props.handleDeleteButton}
                sx={{
                  "&:hover": {
                    color: "#d32f2f", // Color on hover
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
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
  // 編集モードに切り替える関数
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
