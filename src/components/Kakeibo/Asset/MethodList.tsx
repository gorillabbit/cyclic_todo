import {
  TableRow,
  TableCell,
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
} from "../../../utilities/purchaseUtilities";
import { useMethod } from "../../../hooks/useData";

type PlainMethodListProps = {
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
};

const PlainMethodList = memo(
  (props: PlainMethodListProps): JSX.Element => (
    <TableRow key={props.method.id}>
      <TableCell sx={{ px: 0.5 }}>
        <TextField
          variant="outlined"
          value={props.methodInput.label}
          name="label"
          onChange={props.handleMethodInput}
          size="small"
          error={!!props.inputError}
          helperText={props.inputError}
        />
      </TableCell>
      <TableCell sx={{ px: 0.5 }}>
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
      </TableCell>
      <TableCell sx={{ px: 0.5 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!props.isChanged || !!props.inputError}
          onClick={props.saveChanges}
        >
          変更
        </Button>
      </TableCell>
      <TableCell sx={{ px: 0.5 }}>
        <IconButton onClick={props.removeMethod} color="error">
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
);

const MethodList = ({ method }: { method: MethodListType }) => {
  const { methodList } = useMethod();
  const [methodInput, setMethodInput] = useState<MethodListType>(method);

  const handleMethodInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (name === "timingDate") {
        if (isValidatedNum(value) && Number(value) < 32) {
          setMethodInput((prev) => ({ ...prev, [name]: Number(value) }));
          return;
        }
        return;
      }
      setMethodInput((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const inputError = useMemo(() => {
    if (
      methodList.filter(
        (method) =>
          method.label === methodInput.label && method.id !== methodInput.id
      ).length > 0
    ) {
      return "他の支払い方法と同じ名前は禁止です";
    } else {
      return "";
    }
  }, [methodInput, methodList]);

  const handleSelectInput = useCallback((e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setMethodInput((prev) => ({ ...prev, [name]: value }));
  }, []);

  const saveChanges = useCallback(() => {
    if (method.timing === "翌月" && method.timingDate < 1) {
      alert("決済日は1以上を指定してください");
      return;
    }
    updateDocMethod(method.id, methodInput);
  }, [method.id, method.timing, method.timingDate, methodInput]);

  const removeMethod = useCallback(() => {
    deleteDocMethod(method.id);
  }, [method.id]);

  const isChanged = useMemo(
    () =>
      method.label !== methodInput.label ||
      method.timing !== methodInput.timing,
    [method, methodInput]
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
  };

  return <PlainMethodList {...plainProps} />;
};

export default MethodList;
