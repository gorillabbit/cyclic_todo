import {
  TableCell,
  TextField,
  Autocomplete,
  IconButton,
  TableRow,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import { ErrorType, MethodListType } from "../../../../types";
import { getPayLaterDate } from "../../../../utilities/dateUtilities";
import { useMethod, usePurchase } from "../../../../hooks/useData";
import TableCellWrapper from "../../TableCellWrapper";
import { PurchaseDataType } from "../../../../types/purchaseTypes";
import {
  addPurchaseAndUpdateLater,
  deletePurchaseAndUpdateLater,
  updateAndAddPurchases,
  updatePurchaseAndUpdateLater,
} from "../../../../utilities/purchaseUtilities";
import { getHasError, validateEditPurchase } from "../../KakeiboSchemas";

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
  categorySet: string[];
  methodList: MethodListType[];
};

const PlainEditPurchaseRow = memo(
  ({
    editFormData,
    handleEditFormChange,
    categorySet,
    methodList,
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
          <Autocomplete
            value={editFormData.category}
            sx={{ minWidth: 150 }}
            options={categorySet}
            freeSolo
            onChange={(_e, v) => handleEditFormChange("category", v)}
            renderInput={(params) => (
              <TextField {...params} label="分類" size="small" />
            )}
          />
        </TableCellWrapper>
        <TableCellWrapper>
          <Autocomplete
            value={editFormData.method}
            sx={{ minWidth: 150 }}
            options={methodList}
            freeSolo
            onChange={(_e, v) => handleEditFormChange("method", v)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="支払い方法"
                size="small"
                error={!!errors.method}
                helperText={errors.method}
              />
            )}
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
  const { methodList } = useMethod();
  const { categorySet, setPurchaseList } = usePurchase();

  // 編集内容を保存する関数
  const handleSaveClick = useCallback(async () => {
    const method = editFormData.method;
    const timing = method.timing;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, childPurchaseId, ...purchaseWithoutIds } = editFormData;
    // 日付の変更にも対応できるように後払いも更新する
    const childPurchase = {
      ...purchaseWithoutIds,
      date: getPayLaterDate(editFormData.date, method.timingDate),
      childPurchaseId: "",
      id: "",
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

  const validateAndSetErrors = useCallback((input: PurchaseDataType) => {
    const errors = validateEditPurchase(input);
    setErrors(errors);
    return getHasError(errors);
  }, []);

  const setNewPurchaseWithValidation = (
    name: string,
    value: string | Date | boolean | MethodListType | null
  ) => {
    setEditFormData((prev) => {
      const nextPurchase = { ...prev, [name]: value };
      validateAndSetErrors(nextPurchase);
      return nextPurchase;
    });
  };

  const handleEditFormChange = useCallback(
    (name: string, value: string | Date | boolean | MethodListType | null) => {
      setNewPurchaseWithValidation(name, value);
    },
    []
  );

  const plainProps = {
    editFormData,
    categorySet,
    methodList,
    handleEditFormChange,
    handleSaveClick,
    isSmall,
    errors,
    hasError,
  };
  return <PlainEditPurchaseRow {...plainProps} />;
};

export default EditPurchaseRow;
