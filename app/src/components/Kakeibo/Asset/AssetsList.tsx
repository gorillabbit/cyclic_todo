import {
    Table,
    TableBody,
    TableContainer,
    TableRow,
    Paper,
    IconButton,
    TableHead,
    TableCell,
    Tooltip,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { memo, useCallback, useState } from 'react';
import AssetRow from './AssetRow';
import { useTab } from '../../../hooks/useData';
import TableCellWrapper from '../TableCellWrapper';
import { createAsset } from '../../../api/combinedApi';
import { useAccountStore } from '../../../stores/accountStore';
import { useAssetStore } from '../../../stores/assetStore';

const AssetTable = memo(() => {
    const assetStore = useAssetStore();
    const { assetList, fetchAsset } = assetStore;
    const { tabId } = useTab();
    const { Account } = useAccountStore();
    const [isOpen, setIsOpen] = useState(false);

    // TODO 追加時に「残高調整」というメソッドを自動でつくる
    const addAsset = useCallback(async () => {
        if (!Account) return;
        const newAssetLog = {
            userId: Account.id,
            tabId,
            name: '',
            id: new Date().getTime().toString(),
        };
        await createAsset(newAssetLog);
        fetchAsset(tabId);
    }, [tabId, fetchAsset, Account]);

    return (
        <TableContainer component={Paper} sx={{ marginY: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="none">
                            <Tooltip title={isOpen ? '編集を終える' : '資産を編集する'}>
                                <IconButton onClick={() => setIsOpen(!isOpen)}>
                                    {isOpen ? <CloseFullscreenIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCellWrapper label="名前" />
                        <TableCellWrapper label="残高" />
                        <TableCellWrapper label="月末残高" />
                        <TableCellWrapper />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {assetList.map((asset) => (
                        <AssetRow asset={asset} key={asset.id} isOpen={isOpen} />
                    ))}
                    <TableRow>
                        <TableCellWrapper label="合計" colSpan={2} />
                    </TableRow>
                </TableBody>
            </Table>
            {isOpen && (
                <IconButton onClick={addAsset} color="primary">
                    <AddCircleOutlineIcon />
                </IconButton>
            )}
        </TableContainer>
    );
});

export default AssetTable;
