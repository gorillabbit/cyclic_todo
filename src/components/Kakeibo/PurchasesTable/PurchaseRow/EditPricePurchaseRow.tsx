import { TextField, IconButton, TableRow, TableCell } from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import { memo, useCallback } from "react";
import DoneIcon from "@mui/icons-material/Done";
import { InputPurchaseRowType } from "../../../../types";
import { updateDocPurchase } from "../../../../firebase";
import { numericProps } from "../../../../utilities/purchaseUtilities";
import TableCellWrapper from "../../TableCellWrapper";

type UnderHalfRowProps = {
  handleEditFormChange: (event: {
    target: {
      name: string;
      value: unknown;
    };
  }) => void;
  editFormData: InputPurchaseRowType;
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
          value={editFormData.price}
          onChange={handleEditFormChange}
          size="small"
          inputProps={numericProps}
        />
      </TableCellWrapper>
      <TableCellWrapper>
        <PaymentsIcon color={editFormData.income ? "success" : "error"} />
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
}: {
  setIsEditPrice: React.Dispatch<React.SetStateAction<boolean>>;
  editFormData: InputPurchaseRowType;
  setEditFormData: React.Dispatch<React.SetStateAction<InputPurchaseRowType>>;
  isSmall: boolean;
}) => {
  // 編集内容を保存する関数
  const handleSaveClick = useCallback(() => {
    const certainPurchase = { ...editFormData, isUncertain: false };
    updateDocPurchase(editFormData.id, certainPurchase);
    // 決済Purchaseもあるなら変更する
    if (editFormData.childPurchaseId) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, date, ...childPurchaseWithoutId } = certainPurchase;
      updateDocPurchase(editFormData.childPurchaseId, {
        ...childPurchaseWithoutId,
        childPurchaseId: "",
      });
    }
    setEditFormData((prev) => ({ ...prev, isUncertain: false }));
    setIsEditPrice(false);
  }, [editFormData, setEditFormData, setIsEditPrice]);

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
