import {
    TableRow,
    TableCell,
    Collapse,
    Table,
    TableBody,
    TableHead,
} from '@mui/material';
import { memo, useState } from 'react';
import EditPurchaseRow from './EditPurchaseRow';
import NormalPurchaseRow from './NormalPurchaseRow';
import EditPricePurchaseRow from './EditPricePurchaseRow';
import { PurchaseDataType } from '../../../../types/purchaseTypes';
import { usePurchase } from '../../../../hooks/useData';

type PlainPurchasesRowProps = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
    groupPurchases: PurchaseDataType[];
    isGroup: boolean;
    isEdit: boolean;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    editFormData: PurchaseDataType;
    setEditFormData: React.Dispatch<React.SetStateAction<PurchaseDataType>>;
    isSmall: boolean;
    isEditPrice: boolean;
    setIsEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
    index: number;
    purchaseList: PurchaseDataType[];
};

const PlainPurchasesRow = memo(
    ({
        setOpen,
        open,
        groupPurchases,
        isGroup,
        isEdit,
        setIsEdit,
        editFormData,
        setEditFormData,
        isSmall,
        isEditPrice,
        setIsEditPrice,
        index,
        purchaseList,
    }: PlainPurchasesRowProps): JSX.Element => (
        <>
            {isEdit ? (
                <EditPurchaseRow
                    setIsEdit={setIsEdit}
                    editFormData={editFormData}
                    setEditFormData={setEditFormData}
                    isSmall={isSmall}
                    updatePurchases={purchaseList}
                />
            ) : isEditPrice ? (
                <EditPricePurchaseRow
                    setIsEditPrice={setIsEditPrice}
                    editFormData={editFormData}
                    setEditFormData={setEditFormData}
                    isSmall={isSmall}
                    updatePurchases={purchaseList}
                />
            ) : (
                <NormalPurchaseRow
                    isGroup={isGroup}
                    setOpen={setOpen}
                    open={open}
                    editFormData={editFormData}
                    isSmall={isSmall}
                    setIsEdit={setIsEdit}
                    setIsEditPrice={setIsEditPrice}
                    index={index}
                    updatePurchases={purchaseList}
                />
            )}
            {isGroup && (
                <TableRow>
                    <TableCell sx={{ paddingY: 0 }} colSpan={8}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>日付</TableCell>
                                        <TableCell>品目</TableCell>
                                        <TableCell>金額</TableCell>
                                        <TableCell>残高</TableCell>
                                        <TableCell>カテゴリー</TableCell>
                                        <TableCell>備考</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {groupPurchases
                                        .sort(
                                            (a, b) =>
                                                a.date.getTime() -
                                                b.date.getTime()
                                        )
                                        .map((groupPurchase) => (
                                            <TableRow
                                                key={groupPurchase.id}
                                                sx={{
                                                    backgroundColor:
                                                        groupPurchase.difference >
                                                        0
                                                            ? '#fcc9c5'
                                                            : '',
                                                }}
                                            >
                                                <TableCell>
                                                    {
                                                        groupPurchase.date
                                                            .toLocaleString()
                                                            .split(' ')[0]
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {groupPurchase.title}
                                                </TableCell>
                                                <TableCell>
                                                    {groupPurchase.difference +
                                                        '円'}
                                                </TableCell>
                                                <TableCell>
                                                    {groupPurchase.balance +
                                                        '円'}
                                                </TableCell>
                                                <TableCell>
                                                    {groupPurchase.category}
                                                </TableCell>
                                                <TableCell>
                                                    {groupPurchase.description}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </>
    )
);

const PurchasesRow = ({
    purchase,
    groupPurchases,
    isSmall,
    index,
}: {
    purchase: PurchaseDataType;
    groupPurchases: PurchaseDataType[];
    isSmall: boolean;
    index: number;
}) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isEditPrice, setIsEditPrice] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const isGroup = groupPurchases.length > 0;
    const [editFormData, setEditFormData] =
        useState<PurchaseDataType>(purchase);

    const { purchaseList } = usePurchase();

    const plainProps = {
        groupPurchases,
        isGroup,
        isEdit,
        setIsEdit,
        editFormData,
        setEditFormData,
        open,
        setOpen,
        isSmall,
        isEditPrice,
        setIsEditPrice,
        index,
        purchaseList,
    };
    return <PlainPurchasesRow {...plainProps} />;
};

export default PurchasesRow;
