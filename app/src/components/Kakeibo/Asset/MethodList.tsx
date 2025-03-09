import {
    TableRow,
    TableCell,
    Collapse,
    Table,
    TableHead,
    TableBody,
    IconButton,
} from '@mui/material';
import { memo, useCallback } from 'react';
import TableCellWrapper from '../TableCellWrapper';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { defaultMethod, MethodListType } from '../../../types';
import { getAuth } from 'firebase/auth';
import { useMethod, useTab } from '../../../hooks/useData';
import MethodRow from './MethodRow';
import { createMethod } from '../../../api/combinedApi';

const MethodList = memo(
    ({
        open,
        assetId,
        filteredMethodList,
    }: {
        open: boolean;
        assetId: string;
        filteredMethodList: MethodListType[];
    }) => {
        const auth = getAuth();
        const { tabId } = useTab();
        const { fetchMethod } = useMethod();
        const addMethod = useCallback(async () => {
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                const newMethod = {
                    ...defaultMethod,
                    userId,
                    tabId,
                    assetId,
                    id: new Date().getTime().toString(),
                };
                await createMethod(newMethod);
                fetchMethod();
            }
        }, [assetId, auth.currentUser, tabId]);

        return (
            <TableRow>
                <TableCell sx={{ paddingY: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow>
                                    <TableCellWrapper label="名前" />
                                    <TableCellWrapper label="今月の収入" />
                                    <TableCellWrapper label="今月の支出" />
                                    <TableCellWrapper label="決済タイミング" />
                                    <TableCellWrapper colSpan={2} />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredMethodList.map((method) => (
                                    <MethodRow method={method} key={method.id} />
                                ))}
                            </TableBody>
                        </Table>
                        <IconButton onClick={addMethod} color="primary">
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </Collapse>
                </TableCell>
            </TableRow>
        );
    }
);
export default MethodList;
