import { TextField, IconButton, TableRow, TableCell } from "@mui/material";
import { memo, useCallback, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import {
  numericProps,
  updateAndAddPurchases,
  updatePurchaseAndUpdateLater,
} from "../../../../utilities/purchaseUtilities";
import TableCellWrapper from "../../TableCellWrapper";
import { PurchaseDataType } from "../../../../types/purchaseTypes";
import { usePurchase } from "../../../../hooks/useData";
import { ErrorType } from "../../../../types";
import { getHasError, validateEditPurchase } from "../../KakeiboSchemas";

type UnderHalfRowProps = {
  handleEditFormChange: (name: string, value: string | number) => void;
  editFormData: PurchaseDataType;
  handleSaveClick: () => void;
  hasError: boolean;
  errors: ErrorType;
};

const UnderHalfRow = memo(
  ({
    editFormData,
    handleSaveClick,
    handleEditFormChange,
    errors,
    hasError,
  }: UnderHalfRowProps) => (
    <>
      <TableCellWrapper>
        <TextField
          value={editFormData.difference}
          onChange={(e) => handleEditFormChange("difference", e.target.value)}
          size="small"
          inputProps={numericProps}
          error={!!errors.difference}
          helperText={errors.difference}
        />
      </TableCellWrapper>
      <TableCellWrapper label={editFormData.balance} />
      <TableCellWrapper label={editFormData.description} />
      <TableCell padding="none">
        <IconButton
          onClick={handleSaveClick}
          color="success"
          disabled={hasError}
        >
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
    errors,
    hasError,
  }: PlainEditPricePurchaseRowProps): JSX.Element => (
    <>
      <TableRow
        sx={{
          borderColor: editFormData.difference > 0 ? "#c5fcdc" : "#fcc9c5",
          borderRightWidth: 10,
        }}
      >
        <TableCellWrapper />
        <TableCellWrapper
          label={editFormData.date.toLocaleString().split(" ")[0]}
        />
        <TableCellWrapper label={editFormData.title} />

        <TableCellWrapper label={editFormData.category} />
        <TableCellWrapper label={editFormData.method.label} />
        {!isSmall && (
          <UnderHalfRow
            editFormData={editFormData}
            handleSaveClick={handleSaveClick}
            handleEditFormChange={handleEditFormChange}
            errors={errors}
            hasError={hasError}
          />
        )}
      </TableRow>
      {isSmall && (
        <TableRow>
          <TableCellWrapper />
          <UnderHalfRow
            editFormData={editFormData}
            handleSaveClick={handleSaveClick}
            handleEditFormChange={handleEditFormChange}
            errors={errors}
            hasError={hasError}
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
      difference: Number(editFormData.difference),
      isUncertain: false,
    };
    const update = (
      await updatePurchaseAndUpdateLater(certainPurchase, updatePurchases)
    ).purchases;
    updateAndAddPurchases(update);
    setPurchaseList(update);
    setEditFormData((prev) => ({ ...prev, isUncertain: false }));
    setIsEditPrice(false);
  }, [
    editFormData,
    setEditFormData,
    setIsEditPrice,
    setPurchaseList,
    updatePurchases,
  ]);

  const [errors, setErrors] = useState<ErrorType>({});
  const hasError = getHasError(errors);

  const validateAndSetErrors = useCallback((input: PurchaseDataType) => {
    const errors = validateEditPurchase(input);
    setErrors(errors);
    return getHasError(errors);
  }, []);

  const handleEditFormChange = (name: string, value: string | number) => {
    setEditFormData((prev) => {
      const nextPurchase = { ...prev, [name]: value };
      validateAndSetErrors(nextPurchase);
      return nextPurchase;
    });
  };

  const plainProps = {
    editFormData,
    handleEditFormChange,
    handleSaveClick,
    isSmall,
    errors,
    hasError,
  };
  return <PlainEditPricePurchaseRow {...plainProps} />;
};

export default EditPricePurchaseRow;
