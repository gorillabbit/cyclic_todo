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
import { MethodListType } from "../../types";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteDocMethod, updateDocMethod } from "../../firebase";
import { numericProps } from "../../utilities/purchaseUtilities";

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
};

const PlainMethodList = memo(
  (props: PlainMethodListProps): JSX.Element => (
    <TableRow key={props.method.id}>
      <TableCell>
        <TextField
          variant="outlined"
          value={props.methodInput.label}
          name="label"
          onChange={props.handleMethodInput}
          size="small"
        />
      </TableCell>
      <TableCell>
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
      <TableCell>
        <Button
          variant="contained"
          color="primary"
          disabled={!props.isChanged}
          onClick={props.saveChanges}
        >
          変更
        </Button>
      </TableCell>
      <TableCell>
        <IconButton onClick={props.removeMethod} color="error">
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
);

const MethodList = ({ method }: { method: MethodListType }) => {
  const [methodInput, setMethodInput] = useState<MethodListType>(method);

  const handleMethodInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setMethodInput((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSelectInput = useCallback((e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setMethodInput((prev) => ({ ...prev, [name]: value }));
  }, []);

  const saveChanges = useCallback(() => {
    updateDocMethod(method.id, methodInput);
  }, [method.id, methodInput]);

  const removeMethod = useCallback(() => {
    deleteDocMethod(method.id);
  }, [method.id]);

  const isChanged = useMemo(() => {
    if (method.label !== methodInput.label) {
      return true;
    } else if (method.timing !== methodInput.timing) {
      return true;
    } else {
      return false;
    }
  }, [method, methodInput]);

  const plainProps = {
    method,
    methodInput,
    handleMethodInput,
    handleSelectInput,
    isChanged,
    saveChanges,
    removeMethod,
  };

  return <PlainMethodList {...plainProps} />;
};

export default MethodList;
