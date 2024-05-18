import { memo, useCallback, useState } from "react";
import {
  InputPurchaseScheduleRowType,
  PurchaseScheduleListType,
} from "../../../../types";
import DeleteConfirmDialog from "../../DeleteConfirmDialog";
import { usePurchase } from "../../../Context/PurchaseContext";
import { deleteDocPurchaseSchedule } from "../../../../firebase";
import EditPurchaseScheduleRow from "./EditPurchaseScheduleRow";
import { useIsSmall } from "../../../../hooks/useWindowSize";
import NormalPurchaseScheduleRow from "./NormalPurchaseScheduleRow";
import { deleteScheduledPurchases } from "../../../../utilities/purchaseUtilities";

type PlainPurchaseScheduleRowProps = {
  purchaseSchedule: PurchaseScheduleListType;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  editFormData: InputPurchaseScheduleRowType;
  setEditFormData: React.Dispatch<
    React.SetStateAction<InputPurchaseScheduleRowType>
  >;
  deleteAction: () => void;
  isSmall: boolean;
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
  }: PlainPurchaseScheduleRowProps): JSX.Element => (
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
          isSmall={isSmall}
        />
      )}
      <DeleteConfirmDialog
        target={purchaseSchedule.title}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        deleteAction={deleteAction}
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
  const [editFormData, setEditFormData] =
    useState<InputPurchaseScheduleRowType>({
      ...purchaseSchedule,
      endDate: purchaseSchedule.endDate.toDate(),
    });
  const { purchaseList } = usePurchase();

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
  };
  return <PlainPurchaseScheduleRow {...plainProps} />;
};

export default PurchaseScheduleRow;
