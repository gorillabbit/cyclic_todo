import { useCallback, useState } from 'react';
import { InputPurchaseScheduleRowType, PurchaseScheduleListType } from '../../../../types';
import DeleteConfirmDialog from '../../DeleteConfirmDialog';
import { deleteDocPurchaseSchedule } from '../../../../firebase';
import EditPurchaseScheduleRow from './EditPurchaseScheduleRow';
import { useIsSmall } from '../../../../hooks/useWindowSize';
import NormalPurchaseScheduleRow from './NormalPurchaseScheduleRow';
import { deleteScheduledPurchases } from '../../../../utilities/purchaseUtilities';
import { useMethod, usePurchase } from '../../../../hooks/useData';

const PurchaseScheduleRow = ({
    purchaseSchedule,
}: {
    purchaseSchedule: PurchaseScheduleListType;
}) => {
    const isSmall = useIsSmall();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editFormData, setEditFormData] =
        useState<InputPurchaseScheduleRowType>(purchaseSchedule);
    const { purchaseList } = usePurchase();
    const deleteAction = useCallback(() => {
        deleteScheduledPurchases(purchaseSchedule.id);
        deleteDocPurchaseSchedule(purchaseSchedule.id);
    }, [purchaseList, purchaseSchedule]);

    const { methodList } = useMethod();
    const method = methodList.find((method) => method.id === purchaseSchedule.method);

    return (
        <>
            {isEdit ? (
                <EditPurchaseScheduleRow
                    setIsEdit={setIsEdit}
                    editFormData={editFormData}
                    setEditFormData={setEditFormData}
                    isSmall={isSmall}
                />
            ) : (
                <NormalPurchaseScheduleRow
                    editFormData={editFormData}
                    setIsEdit={setIsEdit}
                    setOpenDialog={setOpenDialog}
                    method={method}
                />
            )}
            <DeleteConfirmDialog
                target={purchaseSchedule.title}
                {...{ openDialog, setOpenDialog, deleteAction }}
            />
        </>
    );
};

export default PurchaseScheduleRow;
