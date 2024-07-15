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
import { InputPurchaseRowType, MethodListType } from "../../../../types";
import {
  updateDocPurchase,
  deleteDocPurchase,
  addDocPurchase,
} from "../../../../firebase";
import { getPayLaterDate } from "../../../../utilities/dateUtilities";
import { useMethod, usePurchase } from "../../../../hooks/useData";
import TableCellWrapper from "../../TableCellWrapper";

type UnderHalfRowProps = {
  editFormData: InputPurchaseRowType;
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
          name="price"
          value={editFormData.price}
          onChange={handleEditFormChange}
          size="small"
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
}: {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  editFormData: InputPurchaseRowType;
  setEditFormData: React.Dispatch<React.SetStateAction<InputPurchaseRowType>>;
  isSmall: boolean;
}) => {
  const { methodList } = useMethod();
  const { categorySet } = usePurchase();

  // 編集内容を保存する関数
  const handleSaveClick = useCallback(() => {
    const method = editFormData.method;
    const timing = method.timing;
    const { id, childPurchaseId, ...childPurchaseWithoutIds } = editFormData;
    // 日付の変更にも対応できるように後払いも更新する
    const childPurchase = {
      ...childPurchaseWithoutIds,
      date: getPayLaterDate(editFormData.date, method.timingDate),
    };

    const saveEdits = async () => {
      let update = childPurchaseId;
      if (childPurchaseId) {
        if (timing === "即時") {
          // 後払い → 即時払い = 後払いを消す
          deleteDocPurchase(childPurchaseId);
          update = "";
        } else {
          // 後払い → 後払い = 後払いを更新する
          updateDocPurchase(childPurchaseId, childPurchase);
        }
      } else if (timing === "翌月") {
        // 即時払い → 後払い = 後払いを作る
        const docRef = await addDocPurchase(childPurchase);
        update = docRef.id;
      }
      updateDocPurchase(id, {
        ...editFormData,
        childPurchaseId: update,
      });
      setIsEdit(false);
    };

    saveEdits();
  }, [editFormData, setIsEdit]);

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
