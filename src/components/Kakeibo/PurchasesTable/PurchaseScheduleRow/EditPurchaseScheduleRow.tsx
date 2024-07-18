import {
  TableCell,
  TextField,
  Autocomplete,
  IconButton,
  TableRow,
  InputAdornment,
  MenuItem,
  Select,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback } from "react";
import DoneIcon from "@mui/icons-material/Done";
import {
  InputPurchaseScheduleRowType,
  MethodListType,
} from "../../../../types";
import { updateDocPurchaseSchedule } from "../../../../firebase";
import {
  addScheduledPurchase,
  deleteScheduledPurchases,
  numericProps,
  updateAndAddPurchases,
  weekDaysString,
} from "../../../../utilities/purchaseUtilities";
import { useMethod, usePurchase } from "../../../../hooks/useData";
import TableCellWrapper from "../../TableCellWrapper";

type PlainEditPurchaseScheduleRowProps = {
  editFormData: InputPurchaseScheduleRowType;
  handleDateFormChange: (value: Date | null | undefined) => void;
  handleEditFormChange: (event: {
    target: {
      name: string;
      value: unknown;
    };
  }) => void;
  categorySet: string[];
  handleAutocompleteChange: (name: string, value: unknown) => void;
  methodList: MethodListType[];
  handleMethodChange: (value: string | MethodListType | null) => void;
  isSmall: boolean;
  handleSaveClick: () => void;
};

const PlainEditPurchaseScheduleRow = memo(
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
  }: PlainEditPurchaseScheduleRowProps): JSX.Element => (
    <>
      <TableRow>
        <TableCell sx={{ px: 0.5, display: "flex", gap: 1 }}>
          <Select
            size="small"
            name="cycle"
            value={editFormData.cycle}
            onChange={handleEditFormChange}
          >
            <MenuItem value="毎月">毎月</MenuItem>
            <MenuItem value="毎週">毎週</MenuItem>
          </Select>
          {editFormData.cycle === "毎月" && (
            <TextField
              label="日付"
              name="date"
              size="small"
              value={editFormData.date}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">日</InputAdornment>
                ),
              }}
              inputProps={numericProps}
              sx={{ maxWidth: 150 }}
              onChange={handleEditFormChange}
            />
          )}
          {editFormData.cycle === "毎週" && (
            <Select
              name="day"
              size="small"
              value={editFormData.day}
              onChange={handleEditFormChange}
            >
              {weekDaysString.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          )}
        </TableCell>
        <TableCellWrapper>
          <DatePicker
            name="endDate"
            value={editFormData.endDate}
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
          <TextField
            name="price"
            value={editFormData.price}
            onChange={handleEditFormChange}
            size="small"
          />
        </TableCellWrapper>
        {!isSmall && (
          <>
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
            <TableCellWrapper>
              <TextField
                name="income"
                value={editFormData.income ? "収入" : "支出"}
                onChange={handleEditFormChange}
                size="small"
              />
            </TableCellWrapper>
            <TableCellWrapper>
              <TextField
                name="description"
                value={editFormData.description}
                onChange={handleEditFormChange}
                size="small"
              />
            </TableCellWrapper>
          </>
        )}
        <TableCell padding="none">
          <IconButton onClick={handleSaveClick} color="success">
            <DoneIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      {isSmall && (
        <>
          <TableRow>
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
            <TableCellWrapper>
              <TextField
                name="income"
                value={editFormData.income ? "収入" : "支出"}
                onChange={handleEditFormChange}
                size="small"
              />
            </TableCellWrapper>
            {!isSmall && (
              <TableCellWrapper>
                <TextField
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  size="small"
                />
              </TableCellWrapper>
            )}
            <TableCell padding="none">
              <IconButton onClick={handleSaveClick} color="success">
                <DoneIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </>
      )}
    </>
  )
);

const EditPurchaseScheduleRow = ({
  setIsEdit,
  editFormData,
  setEditFormData,
  isSmall,
}: {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  editFormData: InputPurchaseScheduleRowType;
  setEditFormData: React.Dispatch<
    React.SetStateAction<InputPurchaseScheduleRowType>
  >;
  isSmall: boolean;
}) => {
  const { methodList } = useMethod();
  const { categorySet, purchaseList, setPurchaseList } = usePurchase();

  // 編集内容を保存する関数
  const handleSaveClick = useCallback(async () => {
    const update = purchaseList.filter(
      (purchase) => purchase.assetId === editFormData.method.assetId
    );
    // アップデートし、編集を閉じる
    const updateCurrentPurchaseSchedule = (
      feature: Partial<InputPurchaseScheduleRowType>
    ) => {
      updateDocPurchaseSchedule(editFormData.id, {
        ...editFormData,
        ...feature,
      });
      setIsEdit(false);
    };
    updateCurrentPurchaseSchedule({});
    // まず子タスクをすべて削除し、その後で新たな予定タスクを追加する
    const update2 = await deleteScheduledPurchases(update, editFormData.id);
    // idが含まれると、子タスクのidがそれになってしまう
    const { id: editFormDataId, ...editFormDataWithoutId } = editFormData;
    const update3 = addScheduledPurchase(
      editFormDataId,
      editFormDataWithoutId,
      update2
    );
    updateAndAddPurchases(update3);
    setPurchaseList(update3);
  }, [editFormData, purchaseList, setIsEdit, setPurchaseList]);

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
        endDate: value ?? new Date(),
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
  return <PlainEditPurchaseScheduleRow {...plainProps} />;
};

export default EditPurchaseScheduleRow;
