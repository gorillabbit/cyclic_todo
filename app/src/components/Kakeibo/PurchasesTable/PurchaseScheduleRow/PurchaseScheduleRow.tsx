import { memo, useCallback, useState } from 'react';
import {
    InputPurchaseScheduleRowType,
    MethodListType,
    PurchaseScheduleListType,
} from '../../../../types';
import DeleteConfirmDialog from '../../DeleteConfirmDialog';
import { deleteDocPurchaseSchedule } from '../../../../firebase';
import EditPurchaseScheduleRow from './EditPurchaseScheduleRow';
import { useIsSmall } from '../../../../hooks/useWindowSize';
import NormalPurchaseScheduleRow from './NormalPurchaseScheduleRow';
import { deleteScheduledPurchases } from '../../../../utilities/purchaseUtilities';
import { useMethod, usePurchase } from '../../../../hooks/useData';

type PlainPurchaseScheduleRowProps = {
    purchaseSchedule: PurchaseScheduleListType;
    isEdit: boolean;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    editFormData: InputPurchaseScheduleRowType;
    setEditFormData: React.Dispatch<React.SetStateAction<InputPurchaseScheduleRowType>>;
    deleteAction: () => void;
    isSmall: boolean;
    method: MethodListType;
};

const PlainPurchaseScheduleRow = memo(
    ({
        purchaseSchedule,
        isEdit,
        setIsEdit,
        openDialog,
        setOpenDialog,
        editFormData,
        setEditFormData,
        deleteAction,
        isSmall,
        method,
    }: PlainPurchaseScheduleRowProps) => (
        <>
            {isEdit ? (
                <EditPurchaseScheduleRow
                    setIsEdit={setIsEdit}
                    editFormData={editFormData}
                    setEditFormData={setEditFormData}
                    isSmall={isSmall}
                    method={method}
                />
            ) : (
                <NormalPurchaseScheduleRow
                    editFormData={editFormData}
                    setIsEdit={setIsEdit}
                    setOpenDialog={setOpenDialog}
                    isSmall={isSmall}
                />
            )}
            <DeleteConfirmDialog
                target={purchaseSchedule.title}
                {...{ openDialog, setOpenDialog, deleteAction }}
            />
        </>
    )
);

const PurchaseScheduleRow = ({
    purchaseSchedule,
}: {
    purchaseSchedule: PurchaseScheduleListType;
}) => {
    const isSmall = useIsSmall();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editFormData, setEditFormData] = useState<InputPurchaseScheduleRowType>({
        ...purchaseSchedule,
        endDate: purchaseSchedule.endDate.toDate(),
    });
    const { purchaseList } = usePurchase();
    const { methodList } = useMethod();
    const method = methodList.find((method) => method.id === purchaseSchedule.method);
    if (!method) {
        return <></>;
    }
    const deleteAction = useCallback(() => {
        deleteScheduledPurchases(purchaseList, purchaseSchedule.id);
        deleteDocPurchaseSchedule(purchaseSchedule.id);
    }, [purchaseList, purchaseSchedule]);

    const plainProps = {
        purchaseSchedule,
        isEdit,
        setIsEdit,
        openDialog,
        setOpenDialog,
        editFormData,
        setEditFormData,
        deleteAction,
        isSmall,
        method,
    };
    return <PlainPurchaseScheduleRow {...plainProps} />;
};

export default PurchaseScheduleRow;
