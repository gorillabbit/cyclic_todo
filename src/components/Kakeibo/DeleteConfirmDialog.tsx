import { Dialog, Box, Button } from "@mui/material";
import { memo, useCallback } from "react";

type PlainDeleteConfirmDialogProps = {
  target: JSX.Element | string;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  confirmDelete: () => void;
};

const PlainDeleteConfirmDialog = memo(
  ({
    target,
    openDialog,
    setOpenDialog,
    confirmDelete,
  }: PlainDeleteConfirmDialogProps): JSX.Element => (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <Box display="flex" alignItems="center" m={2}>
        {target}を削除します
      </Box>
      <Box gap={1} display="flex" m={2}>
        <Button variant="contained" color="error" onClick={confirmDelete}>
          削除
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(false)}
        >
          キャンセル
        </Button>
      </Box>
    </Dialog>
  )
);

const DeleteConfirmDialog = ({
  target,
  openDialog,
  setOpenDialog,
  deleteAction,
}: {
  target: JSX.Element | string;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAction: () => void;
}) => {
  const confirmDelete = useCallback(() => {
    deleteAction();
    setOpenDialog(false);
  }, [deleteAction, setOpenDialog]);

  const plainProps = {
    target,
    openDialog,
    setOpenDialog,
    confirmDelete,
  };
  return <PlainDeleteConfirmDialog {...plainProps} />;
};

export default DeleteConfirmDialog;
