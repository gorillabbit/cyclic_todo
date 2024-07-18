import { TextField, IconButton, TableRow, TableCell } from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import { memo, useCallback } from "react";
import DoneIcon from "@mui/icons-material/Done";
import { db, dbNames } from "../../../../firebase";
import {
  numericProps,
  updateAndAddPurchases,
  updatePurchaseAndUpdateLater,
} from "../../../../utilities/purchaseUtilities";
import TableCellWrapper from "../../TableCellWrapper";
import { PurchaseDataType } from "../../../../types/purchaseTypes";
import { doc, getDoc } from "firebase/firestore";
import { usePurchase } from "../../../../hooks/useData";

type UnderHalfRowProps = {
  handleEditFormChange: (event: {
    target: {
      name: string;
      value: unknown;
    };
  }) => void;
  editFormData: PurchaseDataType;
  handleSaveClick: () => void;
};

const UnderHalfRow = memo(
  ({
    editFormData,
    handleSaveClick,
    handleEditFormChange,
  }: UnderHalfRowProps) => (
    <>
      <TableCellWrapper>
        <TextField
          name="price"
          value={editFormData.difference}
          onChange={handleEditFormChange}
          size="small"
          inputProps={numericProps}
        />
      </TableCellWrapper>
      <TableCellWrapper>
        <PaymentsIcon
          color={editFormData.difference > 0 ? "success" : "error"}
        />
      </TableCellWrapper>
      <TableCellWrapper label={editFormData.description} />
      <TableCell padding="none">
        <IconButton onClick={handleSaveClick} color="success">
          <DoneIcon />
        </IconButton>
      </TableCell>
    </>
  )
);

type PlainEditPricePurchaseRowProps = UnderHalfRowProps & {
  isSmall: boolean;
};

const PlainEditPricePurchaseRow = memo(
  ({
    editFormData,
    handleEditFormChange,
    isSmall,
    handleSaveClick,
  }: PlainEditPricePurchaseRowProps): JSX.Element => (
    <>
      <TableRow>
        <TableCellWrapper />
        <TableCellWrapper
          label={editFormData.date.toLocaleString().split(" ")[0]}
        />
        <TableCellWrapper label={editFormData.title} />

        <TableCellWrapper label={editFormData.category} />
        <TableCellWrapper label={editFormData.method.label} />
        {!isSmall && (
          <UnderHalfRow
            {...{ editFormData, handleSaveClick, handleEditFormChange }}
          />
        )}
      </TableRow>
      {isSmall && (
        <TableRow>
          <TableCellWrapper />
          <UnderHalfRow
            {...{ editFormData, handleSaveClick, handleEditFormChange }}
          />
        </TableRow>
      )}
    </>
  )
);

const EditPricePurchaseRow = ({
  setIsEditPrice,
  editFormData,
  setEditFormData,
  isSmall,
  updatePurchases,
}: {
  setIsEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
  editFormData: PurchaseDataType;
  setEditFormData: React.Dispatch<React.SetStateAction<PurchaseDataType>>;
  isSmall: boolean;
  updatePurchases: PurchaseDataType[];
}) => {
  // 編集内容を保存する関数
  const { setPurchaseList } = usePurchase();
  const handleSaveClick = useCallback(async () => {
    const certainPurchase = {
      ...editFormData,
      isUncertain: false,
      date: editFormData.date,
    };
    const update = await updatePurchaseAndUpdateLater(
      editFormData.id,
      certainPurchase,
      updatePurchases
    );
    // 決済Purchaseもあるなら変更する
    if (editFormData.childPurchaseId) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, date, childPurchaseId, ...childPurchaseWithoutId } =
        certainPurchase;
      const childPurchase = (
        await getDoc(doc(db, dbNames.purchase, editFormData.childPurchaseId))
      ).data() as PurchaseDataType;

      const update2 = await updatePurchaseAndUpdateLater(
        editFormData.childPurchaseId,
        {
          ...childPurchaseWithoutId,
          date: childPurchase.date,
          childPurchaseId: "",
          id: "",
        },
        update.purchases
      );
      updateAndAddPurchases(update2.purchases);
      setPurchaseList(update2.purchases);
    } else {
      updateAndAddPurchases(update.purchases);
      setPurchaseList(update.purchases);
    }
    setEditFormData((prev) => ({ ...prev, isUncertain: false }));

    setIsEditPrice(false);
  }, [
    editFormData,
    setEditFormData,
    setIsEditPrice,
    setPurchaseList,
    updatePurchases,
  ]);

  const handleEditFormChange = useCallback(
    (event: { target: { name: string; value: unknown } }) => {
      const { name, value } = event.target;
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setEditFormData]
  );

  const plainProps = {
    editFormData,
    handleEditFormChange,
    handleSaveClick,
    isSmall,
  };
  return <PlainEditPricePurchaseRow {...plainProps} />;
};

export default EditPricePurchaseRow;
