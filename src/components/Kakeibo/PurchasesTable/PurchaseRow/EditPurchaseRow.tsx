import {
  TableCell,
  TextField,
  Autocomplete,
  IconButton,
  TableRow,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback } from "react";
import DoneIcon from "@mui/icons-material/Done";
import { MethodListType } from "../../../../types";
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

type UnderHalfRowProps = {
  editFormData: PurchaseDataType;
  handleEditFormChange: (event: {
    target: {
      name: string;
      value: unknown;
    };
  }) => void;
  handleSaveClick: () => void;
};

const UnderHalfRow = memo(
  ({
    editFormData,
    handleEditFormChange,
    handleSaveClick,
  }: UnderHalfRowProps) => (
    <>
      <TableCellWrapper>
        <TextField
          name="difference"
          value={editFormData.difference}
          onChange={handleEditFormChange}
          size="small"
        />
      </TableCellWrapper>
      <TableCellWrapper label={editFormData.balance} />
      <TableCellWrapper>
        <TextField
          name="description"
          value={editFormData.description}
          onChange={handleEditFormChange}
          size="small"
        />
      </TableCellWrapper>
      <TableCellWrapper label={editFormData.difference > 0 ? "収入" : "支出"} />

      <TableCell padding="none">
        <IconButton onClick={handleSaveClick} color="success">
          <DoneIcon />
        </IconButton>
      </TableCell>
    </>
  )
);

type PlainEditPurchaseRowProps = UnderHalfRowProps & {
  handleDateFormChange: (value: Date | null | undefined) => void;
  isSmall: boolean;
  categorySet: string[];
  methodList: MethodListType[];
  handleAutocompleteChange: (name: string, value: unknown) => void;
  handleMethodChange: (value: string | MethodListType | null) => void;
};

const PlainEditPurchaseRow = memo(
  ({
    editFormData,
    handleDateFormChange,
    handleEditFormChange,
    categorySet,
    handleAutocompleteChange,
    methodList,
    handleMethodChange,
    isSmall,
    handleSaveClick,
  }: PlainEditPurchaseRowProps): JSX.Element => (
    <>
      <TableRow>
        <TableCellWrapper />
        <TableCellWrapper>
          <DatePicker
            name="date"
            value={editFormData.date}
            onChange={handleDateFormChange}
            slotProps={{ textField: { size: "small" } }}
            sx={{ maxWidth: 190 }}
          />
        </TableCellWrapper>
        <TableCellWrapper>
          <TextField
            name="title"
            value={editFormData.title}
            onChange={handleEditFormChange}
            size="small"
          />
        </TableCellWrapper>

        <TableCellWrapper>
          <Autocomplete
            value={editFormData.category}
            sx={{ minWidth: 150 }}
            options={categorySet}
            freeSolo
            onChange={(_e, v) => handleAutocompleteChange("category", v)}
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
            onChange={(_e, v) => handleMethodChange(v)}
            renderInput={(params) => (
              <TextField {...params} label="支払い方法" size="small" />
            )}
          />
        </TableCellWrapper>
        {!isSmall && (
          <UnderHalfRow
            {...{ editFormData, handleEditFormChange, handleSaveClick }}
          />
        )}
      </TableRow>
      {isSmall && (
        <>
          <TableRow>
            <TableCellWrapper />
            <UnderHalfRow
              {...{ editFormData, handleEditFormChange, handleSaveClick }}
            />
          </TableRow>
        </>
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
        date: editFormData.date,
      },
      updatedPurchases
    );

    updateAndAddPurchases(updatedPurchases1.purchases);
    setPurchaseList(updatedPurchases1.purchases);

    setIsEdit(false);
  }, [editFormData, setIsEdit, setPurchaseList, updatePurchases]);

  const handleEditFormChange = useCallback(
    (event: { target: { name: string; value: unknown } }) => {
      const { name, value } = event.target;
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setEditFormData]
  );

  const handleDateFormChange = useCallback(
    (value: Date | null | undefined) => {
      setEditFormData((prev) => ({
        ...prev,
        date: value ?? new Date(),
      }));
    },
    [setEditFormData]
  );

  const handleMethodChange = useCallback(
    (value: string | MethodListType | null) => {
      if (value && typeof value !== "string") {
        setEditFormData((prev) => ({
          ...prev,
          method: value,
        }));
      }
    },
    [setEditFormData]
  );

  const handleAutocompleteChange = useCallback(
    (name: string, value: unknown) => {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setEditFormData]
  );

  const plainProps = {
    editFormData,
    categorySet,
    methodList,
    handleEditFormChange,
    handleDateFormChange,
    handleMethodChange,
    handleSaveClick,
    handleAutocompleteChange,
    isSmall,
  };
  return <PlainEditPurchaseRow {...plainProps} />;
};

export default EditPurchaseRow;
