import { IconButton, Chip, TableRow } from '@mui/material';
import { memo, useMemo } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PurchaseRowButtons from './PurchaseRowButtons';
import TableCellWrapper from '../../TableCellWrapper';
import { PurchaseDataType } from '../../../../types/purchaseTypes';
import { useAsset, useMethod } from '../../../../hooks/useData';

type UnderHalfRowProps = {
    isGroup: boolean;
    editFormData: PurchaseDataType;
    setIsEdit: (value: React.SetStateAction<boolean>) => void;
    setIsEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
    updatePurchases: PurchaseDataType[];
    assetName: string | undefined;
    method: { timing: string; label: string } | undefined;
};

const UnderHalfRow = memo(
    ({
        editFormData,
        isGroup,
        setIsEdit,
        setIsEditPrice,
        updatePurchases,
        assetName,
        method,
    }: UnderHalfRowProps) => (
        <>
            <TableCellWrapper>
                {editFormData.difference}
                {method?.timing === '翌月' && !isGroup && <Chip label="翌月" />}
                {editFormData.isUncertain && <Chip label="未確" />}
            </TableCellWrapper>
            <TableCellWrapper
                label={
                    method?.timing === '翌月' && !isGroup
                        ? '-'
                        : assetName + ' ' + editFormData.balance
                }
            />
            <TableCellWrapper label={editFormData.description} />
            <TableCellWrapper>
                {!isGroup && (
                    <PurchaseRowButtons
                        purchase={editFormData}
                        setIsEdit={setIsEdit}
                        setIsEditPrice={setIsEditPrice}
                        isUncertain={editFormData.isUncertain}
                        updatePurchases={updatePurchases}
                    />
                )}
            </TableCellWrapper>
        </>
    )
);

type PlainNormalPurchaseRowProps = UnderHalfRowProps & {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
    isSmall: boolean;
    rowColor: string;
};

const PlainNormalPurchaseRow = memo(
    ({
        isGroup,
        setOpen,
        open,
        editFormData,
        isSmall,
        setIsEdit,
        setIsEditPrice,
        rowColor,
        updatePurchases,
        assetName,
        method,
    }: PlainNormalPurchaseRowProps) => (
        <>
            <TableRow
                sx={{
                    pb: 0.5,
                    bgcolor: rowColor,
                    borderColor: editFormData.difference > 0 ? '#c5fcdc' : '#fcc9c5',
                    borderRightWidth: 10,
                }}
            >
                <TableCellWrapper>
                    {isGroup && (
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    )}
                </TableCellWrapper>
                <TableCellWrapper label={editFormData.date.toLocaleDateString()} />
                <TableCellWrapper label={editFormData.title} />
                <TableCellWrapper label={editFormData.category} />
                <TableCellWrapper label={method?.label} />
                {!isSmall && (
                    <UnderHalfRow
                        setIsEdit={setIsEdit}
                        setIsEditPrice={setIsEditPrice}
                        editFormData={editFormData}
                        isGroup={isGroup}
                        updatePurchases={updatePurchases}
                        assetName={assetName}
                        method={method}
                    />
                )}
            </TableRow>
            {isSmall && (
                <TableRow sx={{ bgcolor: rowColor }}>
                    <TableCellWrapper />
                    <UnderHalfRow
                        setIsEdit={setIsEdit}
                        setIsEditPrice={setIsEditPrice}
                        editFormData={editFormData}
                        isGroup={isGroup}
                        updatePurchases={updatePurchases}
                        assetName={assetName}
                        method={method}
                    />
                </TableRow>
            )}
        </>
    )
);

const NormalPurchaseRow = (props: {
    isGroup: boolean;
    editFormData: PurchaseDataType;
    setIsEdit: (value: React.SetStateAction<boolean>) => void;
    setIsEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
    updatePurchases: PurchaseDataType[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
    isSmall: boolean;
    index: number;
}) => {
    const rowColor = useMemo(() => (props.index % 2 === 0 ? '#f0f0f0' : 'white'), [props.index]);
    const { assetList } = useAsset();
    const { methodList } = useMethod();
    const assetName = assetList.find((asset) => asset.id === props.editFormData.assetId)?.name;
    const method = methodList.find((m) => m.id === props.editFormData.method);
    const plainProps = { ...props, rowColor, assetName, method };
    // TODO 残高が他の残高と区別できるようにする
    // TODO 残高の推移グラフを描く
    return <PlainNormalPurchaseRow {...plainProps} />;
};

export default NormalPurchaseRow;
