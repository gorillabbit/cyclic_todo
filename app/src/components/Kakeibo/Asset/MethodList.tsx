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
import { defaultMethod, MethodListType, MethodType } from '../../../types';
import { getAuth } from 'firebase/auth';
import { addDocMethod } from '../../../firebase';
import { useTab } from '../../../hooks/useData';
import MethodRow from './MethodRow';

type PlainMethodListProps = {
    open: boolean;
    filteredMethodList: MethodListType[];
    addMethod: () => void;
};

const PlainMethodList = memo(({ open, filteredMethodList, addMethod }: PlainMethodListProps) => (
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
));

const MethodList = memo(
    ({
        open,
        asset_id,
        filteredMethodList,
    }: {
        open: boolean;
        asset_id: string;
        filteredMethodList: MethodListType[];
    }) => {
        const auth = getAuth();
        const { tab_id } = useTab();
        const addMethod = useCallback(() => {
            if (auth.currentUser) {
                const user_id = auth.currentUser.uid;
                const newMethod: MethodType = {
                    ...defaultMethod,
                    user_id,
                    tab_id,
                    asset_id,
                };
                addDocMethod(newMethod);
            }
        }, [asset_id, auth.currentUser, tab_id]);
        const plainProps = {
            open,
            filteredMethodList,
            addMethod,
        };
        return <PlainMethodList {...plainProps} />;
    }
);
export default MethodList;
