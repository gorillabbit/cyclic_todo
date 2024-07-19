import {
  TableRow,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputAdornment,
} from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import { MethodListType } from "../../../types";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteDocMethod, updateDocMethod } from "../../../firebase";
import {
  isValidatedNum,
  numericProps,
  sumSpentAndIncome,
} from "../../../utilities/purchaseUtilities";
import { useMethod, usePurchase } from "../../../hooks/useData";
import TableCellWrapper from "../TableCellWrapper";
import {
  getNextMonthFirstDay,
  getThisMonthFirstDay,
} from "../../../utilities/dateUtilities";

type PlainMethodRowProps = {
  method: MethodListType;
  methodInput: MethodListType;
  handleMethodInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectInput: (e: SelectChangeEvent<string>) => void;
  isChanged: boolean;
  removeMethod: () => void;
  saveChanges: () => void;
  inputError: string;
  thisMonthSpent: number;
  thisMonthIncome: number;
};

const PlainMethodRow = memo(
  (props: PlainMethodRowProps): JSX.Element => (
    <TableRow key={props.method.id}>
      <TableCellWrapper>
        <TextField
          variant="outlined"
          value={props.methodInput.label}
          name="label"
          onChange={props.handleMethodInput}
          size="small"
          error={!!props.inputError}
          helperText={props.inputError}
        />
      </TableCellWrapper>
      <TableCellWrapper label={props.thisMonthIncome} />
      <TableCellWrapper label={-props.thisMonthSpent} />
      <TableCellWrapper>
        <Select
          value={props.methodInput.timing}
          name="timing"
          onChange={props.handleSelectInput}
          size="small"
        >
          <MenuItem value="即時">即時</MenuItem>
          <MenuItem value="翌月">翌月</MenuItem>
        </Select>
        {props.methodInput.timing === "翌月" && (
          <TextField
            name="timingDate"
            value={props.methodInput.timingDate}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">日</InputAdornment>
              ),
            }}
            inputProps={numericProps}
            sx={{ maxWidth: 70, marginLeft: 1 }}
            onChange={props.handleMethodInput}
            size="small"
          />
        )}
      </TableCellWrapper>
      <TableCellWrapper>
        <Button
          variant="contained"
          color="primary"
          disabled={!props.isChanged || !!props.inputError}
          onClick={props.saveChanges}
        >
          変更
        </Button>
      </TableCellWrapper>
      <TableCellWrapper>
        <IconButton onClick={props.removeMethod} color="error">
          <DeleteIcon />
        </IconButton>
      </TableCellWrapper>
    </TableRow>
  )
);

const MethodRow = ({ method }: { method: MethodListType }) => {
  const { methodList } = useMethod();
  const [methodInput, setMethodInput] = useState<MethodListType>(method);

  const handleMethodInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (name === "timingDate") {
        if (isValidatedNum(value) && Number(value) < 32)
          return setMethodInput((prev) => ({ ...prev, [name]: Number(value) }));
        return;
      }
      setMethodInput((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSelectInput = useCallback((e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setMethodInput((prev) => ({ ...prev, [name]: value }));
  }, []);

  const inputError = useMemo(() => {
    return methodList.filter(
      (m) => m.label === methodInput.label && m.id !== methodInput.id
    ).length > 0
      ? "他の支払い方法と同じ名前は禁止です"
      : "";
  }, [methodInput, methodList]);

  const saveChanges = useCallback(() => {
    if (method.timing === "翌月" && method.timingDate < 1)
      return alert("決済日は1以上を指定してください");
    updateDocMethod(method.id, methodInput);
  }, [method, methodInput]);

  const removeMethod = useCallback(() => {
    deleteDocMethod(method.id);
  }, [method.id]);

  const isChanged = useMemo(
    () =>
      method.label !== methodInput.label ||
      method.timing !== methodInput.timing,
    [method, methodInput]
  );
  const { purchaseList } = usePurchase();
  const methodPurchase = purchaseList.filter((p) => p.method.id === method.id);
  const thisMonthPurchase = methodPurchase.filter(
    (p) => getNextMonthFirstDay() > p.date && p.date >= getThisMonthFirstDay()
  );
  const thisMonthSpent = sumSpentAndIncome(
    thisMonthPurchase.filter((p) => p.difference < 0)
  );
  const thisMonthIncome = sumSpentAndIncome(
    thisMonthPurchase.filter((p) => p.difference > 0)
  );

  const plainProps = {
    method,
    methodInput,
    handleMethodInput,
    handleSelectInput,
    isChanged,
    saveChanges,
    removeMethod,
    inputError,
    thisMonthSpent,
    thisMonthIncome,
  };

  return <PlainMethodRow {...plainProps} />;
};

export default MethodRow;
