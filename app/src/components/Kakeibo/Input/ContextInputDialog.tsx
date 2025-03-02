import { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

interface ContextInputDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (context: string) => void;
    initialContext: string;
}

const ContextInputDialog = ({ open, onClose, onSave, initialContext }: ContextInputDialogProps) => {
    const [context, setContext] = useState<string>(initialContext);

    useEffect(() => {
        setContext(initialContext);
    }, [initialContext]);

    const handleSave = () => {
        onSave(context);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Gemini Context</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="context"
                    label="Additional Context for Gemini"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContextInputDialog;
