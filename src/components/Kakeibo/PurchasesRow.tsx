import {
  TableRow,
  TableCell,
  TextField,
  Autocomplete,
  IconButton,
  Chip,
  Collapse,
  Table,
  TableBody,
  TableHead,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { memo, useCallback, useState } from "react";
import { deleteDocPurchase, updateDocPurchase } from "../../firebase";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { MethodListType, PurchaseListType } from "../../types";
import { Timestamp } from "firebase/firestore";
import { usePurchase } from "../Context/PurchaseContext";
import { useMethod } from "../Context/MethodContext";

type PlainPurchasesRowProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  purchase: PurchaseListType;
  groupPurchases: PurchaseListType[];
  isGroup: boolean;
  isEdit: boolean;
  editFormData: PurchaseListType;
  categorySet: string[];
  methodList: MethodListType[];
  handleEditFormChange: (event: {
    target: {
      name: string;
      value: any;
    };
  }) => void;
  handleDateFormChange: (value: Date | null | undefined) => void;
  handleMethodChange: (value: string | MethodListType | null) => void;
  handleSaveClick: () => void;
  handleEditClick: () => void;
  handleAutocompleteChange: (name: string, value: any) => void;
  getMethodName: (methodId: string) => string;
  isSmall: boolean;
};

const PlainPurchasesRow = memo(
  (props: PlainPurchasesRowProps): JSX.Element => (
    <>
      <TableRow>
        {props.isEdit ? (
          <>
            <TableCell sx={{ paddingX: 0.5 }} />
            <TableCell sx={{ paddingX: 0.5 }}>
              <DatePicker
                name="date"
                value={props.editFormData.date.toDate()}
                onChange={props.handleDateFormChange}
                slotProps={{ textField: { size: "small" } }}
                sx={{ maxWidth: 190 }}
              />
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              <TextField
                name="title"
                value={props.editFormData.title}
                onChange={props.handleEditFormChange}
                size="small"
              />
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              <TextField
                name="price"
                value={props.editFormData.price}
                onChange={props.handleEditFormChange}
                size="small"
              />
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              <Autocomplete
                value={props.editFormData.category}
                sx={{ minWidth: 150 }}
                options={props.categorySet}
                freeSolo
                onChange={(e, v) =>
                  props.handleAutocompleteChange("category", v)
                }
                renderInput={(params) => (
                  <TextField {...params} label="分類" size="small" />
                )}
              />
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              <Autocomplete
                value={props.editFormData.method}
                sx={{ minWidth: 150 }}
                options={props.methodList}
                freeSolo
                onChange={(_e, v) => props.handleMethodChange(v)}
                renderInput={(params) => (
                  <TextField {...params} label="支払い方法" size="small" />
                )}
              />
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              <TextField
                name="income"
                value={props.editFormData.income ? "収入" : "支出"}
                onChange={props.handleEditFormChange}
                size="small"
              />
            </TableCell>
            {!props.isSmall && (
              <TableCell sx={{ paddingX: 0.5 }}>
                <TextField
                  name="description"
                  value={props.editFormData.description}
                  onChange={props.handleEditFormChange}
                  size="small"
                />
              </TableCell>
            )}
            <TableCell padding="none">
              <IconButton onClick={props.handleSaveClick} color="success">
                <DoneIcon />
              </IconButton>
            </TableCell>
          </>
        ) : (
          <>
            <TableCell>
              {props.isGroup && (
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => props.setOpen(!props.open)}
                >
                  {props.open ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>
              )}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.editFormData.date.toDate().toLocaleString().split(" ")[0]}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.isGroup
                ? props.editFormData.method.label + " 引き落し"
                : props.editFormData.title}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.editFormData.price + "円"}
              {props.editFormData.method.timing === "翌月" &&
                props.editFormData.childPurchaseId && <Chip label="翌月" />}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.editFormData.category}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.editFormData.method.label}
            </TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>
              {props.editFormData.income ? "収入" : "支出"}
            </TableCell>
            {!props.isSmall && (
              <TableCell>{props.editFormData.description}</TableCell>
            )}
            <TableCell padding="none">
              {!props.isGroup && (
                <IconButton
                  onClick={props.handleEditClick}
                  sx={{
                    "&:hover": {
                      color: "#1976d2", // Color on hover
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </TableCell>
          </>
        )}
        <TableCell padding="none">
          {!props.isGroup && (
            <IconButton
              onClick={() => deleteDocPurchase(props.purchase.id)}
              sx={{
                "&:hover": {
                  color: "#d32f2f", // Color on hover
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      {props.isGroup && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={props.open} timeout="auto" unmountOnExit>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>日付</TableCell>
                    <TableCell>品目</TableCell>
                    <TableCell>金額</TableCell>
                    <TableCell>カテゴリー</TableCell>
                    <TableCell>収入</TableCell>
                    <TableCell>備考</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.groupPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>
                        {purchase.date.toDate().toLocaleString().split(" ")[0]}
                      </TableCell>
                      <TableCell> {purchase.title}</TableCell>
                      <TableCell>{purchase.price + "円"}</TableCell>
                      <TableCell>{purchase.category}</TableCell>
                      <TableCell>{purchase.income ? "収入" : "支出"}</TableCell>
                      <TableCell>{purchase.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  )
);

const PurchasesRow = ({
  purchase,
  groupPurchases,
  isSmall,
}: {
  purchase: PurchaseListType;
  groupPurchases: PurchaseListType[];
  isSmall: boolean;
}) => {
  const { methodList } = useMethod();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  // 編集中のデータを保持するステート
  const [editFormData, setEditFormData] = useState<PurchaseListType>(purchase);
  const [open, setOpen] = useState(false);
  const { categorySet } = usePurchase();
  const isGroup = groupPurchases.length > 0;

  // 編集モードに切り替える関数
  const handleEditClick = useCallback(() => {
    setIsEdit(true);
  }, []);

  // 編集内容を保存する関数
  const handleSaveClick = useCallback(() => {
    updateDocPurchase(editFormData.id, editFormData);
    setIsEdit(false);
  }, [editFormData]);

  // 編集データを更新する関数
  const handleEditFormChange = useCallback(
    (event: { target: { name: string; value: any } }) => {
      const { name, value } = event.target;
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
  // 日付はTimestampに変換する必要があるので変換する
  const handleDateFormChange = useCallback((value: Date | null | undefined) => {
    setEditFormData((prev) => ({
      ...prev,
      date: Timestamp.fromDate(value ?? prev.date.toDate()),
    }));
  }, []);

  const handleMethodChange = useCallback(
    (value: string | MethodListType | null) => {
      if (value && typeof value !== "string") {
        setEditFormData((prev) => ({
          ...prev,
          method: value,
        }));
      }
    },
    []
  );
  const handleAutocompleteChange = useCallback((name: string, value: any) => {
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const plainProps = {
    purchase,
    groupPurchases,
    isGroup,
    isEdit,
    editFormData,
    categorySet,
    methodList,
    handleEditFormChange,
    handleDateFormChange,
    handleMethodChange,
    handleSaveClick,
    handleEditClick,
    handleAutocompleteChange,
    open,
    setOpen,
    getMethodName,
    isSmall,
  };
  return <PlainPurchasesRow {...plainProps} />;
};

export default PurchasesRow;
