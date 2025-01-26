import { Dialog, Box, Button } from '@mui/material';
import { JSX, useCallback } from 'react';

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

    return (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <Box display="flex" alignItems="center" m={2}>
                {target}を削除します
            </Box>
            <Box gap={1} display="flex" m={2}>
                <Button variant="contained" color="error" onClick={confirmDelete}>
                    削除
                </Button>
                <Button variant="contained" color="primary" onClick={() => setOpenDialog(false)}>
                    キャンセル
                </Button>
            </Box>
        </Dialog>
    );
};

export default DeleteConfirmDialog;
