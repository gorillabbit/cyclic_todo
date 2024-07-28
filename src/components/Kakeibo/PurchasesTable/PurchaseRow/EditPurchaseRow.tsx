import { TableCell, TextField, IconButton, TableRow } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import { ErrorType, MethodListType } from "../../../../types";
import { getPayLaterDate } from "../../../../utilities/dateUtilities";
import { usePurchase } from "../../../../hooks/useData";
import TableCellWrapper from "../../TableCellWrapper";
import { PurchaseDataType } from "../../../../types/purchaseTypes";
import {
  addPurchaseAndUpdateLater,
  deletePurchaseAndUpdateLater,
  updateAndAddPurchases,
  updatePurchaseAndUpdateLater,
} from "../../../../utilities/purchaseUtilities";
import { getHasError, validateEditPurchase } from "../../KakeiboSchemas";
import MethodSelector from "../../ScreenParts/MethodSelector";
import CategorySelector from "../../ScreenParts/CategorySelector";

type UnderHalfRowProps = {
  editFormData: PurchaseDataType;
  handleEditFormChange: (
    name: string,
    value: string | Date | boolean | MethodListType | null
  ) => void;
  handleSaveClick: () => void;
  hasError: boolean;
  errors: ErrorType;
};

const UnderHalfRow = memo(
  ({
    editFormData,
    handleEditFormChange,
    handleSaveClick,
    errors,
    hasError,
  }: UnderHalfRowProps) => (
    <>
      <TableCellWrapper>
        <TextField
          value={editFormData.difference}
          onChange={(e) => handleEditFormChange("difference", e.target.value)}
          size="small"
          error={!!errors.difference}
          helperText={errors.difference}
        />
      </TableCellWrapper>
      <TableCellWrapper label={editFormData.balance} />
      <TableCellWrapper>
        <TextField
          name="description"
          value={editFormData.description}
          onChange={(e) => handleEditFormChange("description", e.target.value)}
          size="small"
        />
      </TableCellWrapper>
      <TableCellWrapper label={editFormData.difference > 0 ? "収入" : "支出"} />

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

type PlainEditPurchaseRowProps = UnderHalfRowProps & {
  isSmall: boolean;
};

const PlainEditPurchaseRow = memo(
  ({
    editFormData,
    handleEditFormChange,
    isSmall,
    handleSaveClick,
    errors,
    hasError,
  }: PlainEditPurchaseRowProps): JSX.Element => (
    <>
      <TableRow>
        <TableCellWrapper />
        <TableCellWrapper>
          <DatePicker
            value={editFormData.date}
            onChange={(v) => handleEditFormChange("date", v)}
            slotProps={{ textField: { size: "small" } }}
            sx={{ maxWidth: 190 }}
          />
        </TableCellWrapper>
        <TableCellWrapper>
          <TextField
            value={editFormData.title}
            onChange={(e) => handleEditFormChange("title", e.target.value)}
            size="small"
            error={!!errors.title}
            helperText={errors.title}
          />
        </TableCellWrapper>
        <TableCellWrapper>
          <CategorySelector
            newCategory={editFormData.category}
            handleInput={handleEditFormChange}
            isSmall
          />
        </TableCellWrapper>
        <TableCellWrapper>
          <MethodSelector
            newMethod={editFormData.method}
            handleInput={handleEditFormChange}
            errors={errors.method}
            isSmall
          />
        </TableCellWrapper>
        {!isSmall && (
          <UnderHalfRow
            editFormData={editFormData}
            handleEditFormChange={handleEditFormChange}
            handleSaveClick={handleSaveClick}
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
            handleEditFormChange={handleEditFormChange}
            handleSaveClick={handleSaveClick}
            errors={errors}
            hasError={hasError}
          />
        </TableRow>
      )}
    </>
  )
);

const EditPurchaseRow = ({
  setIsEdit,
  editFormData,
  setEditFormData,
  isSmall,
  updatePurchases,
}: {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  editFormData: PurchaseDataType;
  setEditFormData: React.Dispatch<React.SetStateAction<PurchaseDataType>>;
  isSmall: boolean;
  updatePurchases: PurchaseDataType[];
}) => {
  const { setPurchaseList } = usePurchase();

  // 編集内容を保存する関数
  const handleSaveClick = useCallback(async () => {
    const { timing, timingDate } = editFormData.method;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, childPurchaseId, ...purchaseWithoutIds } = editFormData;
    // 日付の変更にも対応できるように後払いも更新する
    const childPurchase = {
      ...purchaseWithoutIds,
      date: getPayLaterDate(editFormData.date, timingDate),
      childPurchaseId: "",
      id: childPurchaseId,
    };
    // TODO ここらへんのTimestampやらDateやらの変換をどうにかする
    let update = { childPurchaseId, difference: editFormData.difference };
    let updatedPurchases = updatePurchases;
    if (childPurchaseId) {
      if (timing === "即時") {
        // 後払い → 即時払い = 後払いを消す
        updatedPurchases = await deletePurchaseAndUpdateLater(
          childPurchaseId,
          updatePurchases
        );
        update = { ...update, childPurchaseId: "" };
      } else {
        // 後払い → 後払い = 後払いを更新する
        updatedPurchases = (
          await updatePurchaseAndUpdateLater(
            childPurchaseId,
            childPurchase,
            updatePurchases
          )
        ).purchases;
      }
    } else if (timing === "翌月") {
      // 即時払い → 後払い = 後払いを作る
      const docs = addPurchaseAndUpdateLater(childPurchase, updatePurchases);
      update = { ...update, childPurchaseId: docs.id, difference: 0 };
      updatedPurchases = docs.purchases;
    }
    const updatedPurchases1 = await updatePurchaseAndUpdateLater(
      editFormData.id,
      {
        ...editFormData,
        ...update,
      },
      updatedPurchases
    );
    // 編集が完了したあとにそれとわかる何かを表示するスナックバーなど。
    updateAndAddPurchases(updatedPurchases1.purchases);
    setPurchaseList(updatedPurchases1.purchases);
    setIsEdit(false);
  }, [editFormData, setIsEdit, setPurchaseList, updatePurchases]);

  const [errors, setErrors] = useState<ErrorType>({});
  const hasError = getHasError(errors);

  const handleEditFormChange = useCallback(
    (name: string, value: string | Date | boolean | MethodListType | null) => {
      setEditFormData((prev) => {
        const nextPurchase = { ...prev, [name]: value };
        const errors = validateEditPurchase(nextPurchase);
        setErrors(errors);
        return nextPurchase;
      });
    },
    []
  );

  const plainProps = {
    editFormData,
    handleEditFormChange,
    handleSaveClick,
    isSmall,
    errors,
    hasError,
  };
  return <PlainEditPurchaseRow {...plainProps} />;
};

export default EditPurchaseRow;
