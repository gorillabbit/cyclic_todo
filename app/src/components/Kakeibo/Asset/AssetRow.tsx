import {
    TableRow,
    TableCell,
    TextField,
    Button,
    IconButton,
    TextFieldVariants,
    TextFieldProps,
} from '@mui/material';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { AssetListType, MethodListType } from '../../../types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import { getLastBalance } from '../../../utilities/purchaseUtilities';
import DeleteConfirmDialog from '../DeleteConfirmDialog';
import { useIsSmall } from '../../../hooks/useWindowSize';
import { useAccount, useMethod, usePurchase, useTab } from '../../../hooks/useData';
import TableCellWrapper from '../TableCellWrapper';
import { getFutureMonthFirstDay } from '../../../utilities/dateUtilities';
import MethodList from './MethodList';
import { PurchaseDataType } from '../../../types/purchaseTypes';
import {
    createPurchase,
    deleteAsset,
    deleteMethod,
    updateAsset,
} from '../../../utilities/apiClient';

const tableInputStyle: {
    sx: TextFieldProps['sx'];
    variant: TextFieldVariants;
    size: 'small';
} = {
    sx: { maxWidth: 150 },
    variant: 'outlined',
    size: 'small',
};

type UnderHalfRowProps = {
    isNameChanged: boolean | undefined;
    isBalanceChanged: boolean | undefined;
    removeAsset: () => void;
    saveChanges: () => void;
};

const UnderHalfRow = memo(
    ({ isNameChanged, isBalanceChanged, saveChanges, removeAsset }: UnderHalfRowProps) => (
        <TableCellWrapper align="right" colSpan={2} sx={{ borderBottom: 0 }}>
            <Button
                variant={isNameChanged || isBalanceChanged ? 'contained' : 'text'}
                color="primary"
                disabled={!isNameChanged && !isBalanceChanged}
                onClick={saveChanges}
            >
                変更
            </Button>
            <IconButton onClick={removeAsset} color="error">
                <DeleteIcon />
            </IconButton>
        </TableCellWrapper>
    )
);

type PlainAssetRowProps = UnderHalfRowProps & {
    assetNameInput: string;
    assetId: string;
    handleAssetInput: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    filteredMethodList: MethodListType[];
    handleBalanceInput: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    balanceInput: number | undefined;
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    deleteAction: () => void;
    isSmall: boolean;
    lastBalance: number;
    monthEndBalance: number;
    isOpen: boolean;
};

const PlainAssetRow = memo(
    ({
        open,
        setOpen,
        assetNameInput,
        handleAssetInput,
        isNameChanged,
        isBalanceChanged,
        saveChanges,
        removeAsset,
        filteredMethodList,
        handleBalanceInput,
        balanceInput,
        openDialog,
        setOpenDialog,
        deleteAction,
        isSmall,
        assetId,
        lastBalance,
        monthEndBalance,
        isOpen,
    }: PlainAssetRowProps) => (
        <>
            <TableRow>
                <TableCell padding="none" sx={{ borderBottom: 0 }}>
                    {isOpen && (
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    )}
                </TableCell>
                <TableCellWrapper sx={{ borderBottom: 0 }}>
                    {isOpen ? (
                        <TextField
                            {...tableInputStyle}
                            value={assetNameInput}
                            name="name"
                            onChange={handleAssetInput}
                        />
                    ) : (
                        <>{assetNameInput}</>
                    )}
                </TableCellWrapper>
                <TableCellWrapper sx={{ borderBottom: 0 }}>
                    {/* 残高 */}
                    {isOpen ? (
                        <TextField
                            {...tableInputStyle}
                            value={isBalanceChanged ? balanceInput : lastBalance}
                            name="balance"
                            onChange={handleBalanceInput}
                        />
                    ) : (
                        <>{lastBalance}</>
                    )}
                </TableCellWrapper>
                <TableCellWrapper sx={{ borderBottom: 0 }}>
                    {/* 月末残高 */}
                    {monthEndBalance}
                </TableCellWrapper>
                {!isSmall && isOpen && (
                    <UnderHalfRow
                        isNameChanged={isNameChanged}
                        isBalanceChanged={isBalanceChanged}
                        saveChanges={saveChanges}
                        removeAsset={removeAsset}
                    />
                )}
            </TableRow>
            {isSmall && isOpen && (
                <TableRow>
                    <TableCellWrapper colSpan={2} sx={{ borderBottom: 0 }} />
                    <UnderHalfRow
                        isNameChanged={isNameChanged}
                        isBalanceChanged={isBalanceChanged}
                        saveChanges={saveChanges}
                        removeAsset={removeAsset}
                    />
                </TableRow>
            )}

            <MethodList open={open} assetId={assetId} filteredMethodList={filteredMethodList} />
            <DeleteConfirmDialog
                target={assetNameInput}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                deleteAction={deleteAction}
            />
        </>
    )
);

const AssetRow = memo(({ asset, isOpen }: { asset: AssetListType; isOpen: boolean }) => {
    const assetId = asset.id;
    const assetName = asset.name;
    const { purchaseList } = usePurchase();
    const [updatePurchases, setUpdatePurchases] = useState<PurchaseDataType[]>([]);

    useEffect(() => {
        setUpdatePurchases(purchaseList.filter((p) => p.assetId === assetId));
    }, [purchaseList, assetId]);

    const [balanceInput, setBalanceInput] = useState<number | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [assetNameInput, setAssetNameInput] = useState<string>(assetName);
    const lastBalance = getLastBalance(assetId, new Date(), updatePurchases);
    const monthEndBalance = getLastBalance(assetId, getFutureMonthFirstDay(), updatePurchases);
    const isSmall = useIsSmall();

    const handleAssetInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setAssetNameInput(e.target.value);
        },
        []
    );

    const isNameChanged = assetName !== assetNameInput;

    const handleBalanceInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const numValue = Number(e.target.value);
            Number.isNaN(numValue) ? alert('不適切な入力です') : setBalanceInput(numValue);
        },
        []
    );

    // TODO どういう時に「変更」が活性化するかきちんと考える
    const isBalanceChanged = useMemo(
        () => balanceInput !== undefined && lastBalance !== balanceInput,
        [balanceInput, lastBalance]
    );

    const { Account } = useAccount();
    const userId = Account?.id;
    const { tabId } = useTab();

    // 編集内容を保存する関数
    const saveChanges = useCallback(() => {
        if (isBalanceChanged && balanceInput && userId) {
            createPurchase({
                id: new Date().getTime().toString(),
                assetId,
                balance: balanceInput,
                date: new Date(),
                payDate: new Date(),
                difference: balanceInput - lastBalance,
                userId,
                tabId,
                title: `${asset.name}残高調整`,
                method: '',
                category: '',
                description: '',
            });
        }
        updateAsset(assetId, { name: assetNameInput });
    }, [
        asset.name,
        assetId,
        assetNameInput,
        balanceInput,
        isBalanceChanged,
        lastBalance,
        tabId,
        userId,
    ]);

    const { methodList } = useMethod();
    const filteredMethodList = useMemo(
        () => methodList.filter((method) => method.assetId === assetId),
        [methodList, assetId]
    );

    const removeAsset = useCallback(() => {
        setOpenDialog(true);
    }, []);

    const deleteAction = useCallback(() => {
        deleteAsset(assetId);
        if (filteredMethodList.length > 0) {
            filteredMethodList.forEach((method) => deleteMethod(method.id));
        }
    }, [assetId, filteredMethodList]);

    const plainProps = {
        open,
        setOpen,
        assetNameInput,
        handleAssetInput,
        isNameChanged,
        isBalanceChanged,
        saveChanges,
        removeAsset,
        filteredMethodList,
        handleBalanceInput,
        balanceInput,
        openDialog,
        setOpenDialog,
        deleteAction,
        isSmall,
        lastBalance,
        monthEndBalance,
        assetId,
        isOpen,
    };

    return <PlainAssetRow {...plainProps} />;
});

export default AssetRow;
