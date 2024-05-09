import {
  TableRow,
  TableCell,
  Collapse,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableHead,
} from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import { AssetInputType, MethodListType, MethodType } from "../../types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { addDocMethod, deleteDocAsset, updateDocAsset } from "../../firebase";
import { getAuth } from "firebase/auth";
import MethodList from "./MethodList";
import { useMethod } from "../Context/MethodContext";

type PlainAssetRowProps = {
  asset: AssetInputType;
  assetInput: AssetInputType;
  handleAssetInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isChanged: boolean;
  removeAsset: () => void;
  saveChanges: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filteredMethodList: MethodListType[];
  addMethod: () => void;
};

const PlainAssetRow = memo(
  (props: PlainAssetRowProps): JSX.Element => (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => props.setOpen(!props.open)}
          >
            {props.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <TextField
            variant="outlined"
            value={props.assetInput.name ?? props.asset.name}
            name="name"
            onChange={props.handleAssetInput}
            size="small"
          />
        </TableCell>
        <TableCell>
          <TextField
            type="number"
            variant="outlined"
            value={props.assetInput.balance ?? props.asset.balance}
            name="balance"
            onChange={props.handleAssetInput}
            size="small"
          />
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
          <IconButton onClick={props.removeAsset} color="error">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={props.open} timeout="auto" unmountOnExit>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>名前</TableCell>
                  <TableCell>決済タイミング</TableCell>
                  <TableCell>変更保存</TableCell>
                  <TableCell>削除</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.filteredMethodList.map((method) => (
                  <MethodList method={method} key={method.id} />
                ))}
              </TableBody>
            </Table>
            <IconButton onClick={props.addMethod} color="primary">
              <AddCircleOutlineIcon />
            </IconButton>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
);

const AssetRow = ({ asset }: { asset: AssetInputType }) => {
  const [open, setOpen] = useState(false);
  const [assetInput, setAssetInput] = useState<AssetInputType>(asset);

  const handleAssetInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setAssetInput((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const saveChanges = useCallback(() => {
    updateDocAsset(asset.id, assetInput);
  }, [asset.id, assetInput]);

  const removeAsset = useCallback(() => {
    deleteDocAsset(asset.id);
  }, [asset.id]);

  const isChanged = useMemo(() => {
    if (asset.name !== assetInput.name) {
      return true;
    } else if (asset.balance !== assetInput.balance) {
      return true;
    } else {
      return false;
    }
  }, [asset, assetInput]);

  const { methodList } = useMethod();
  const filteredMethodList = methodList.filter(
    (method) => method.assetId === asset.id
  );

  const auth = getAuth();
  const addMethod = useCallback(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const newMethod: MethodType = {
        userId: userId,
        label: "",
        assetId: asset.id,
        timing: "即時",
      };
      addDocMethod(newMethod);
    }
  }, [asset.id, auth.currentUser]);

  const plainProps = {
    asset,
    open,
    setOpen,
    assetInput,
    handleAssetInput,
    isChanged,
    saveChanges,
    removeAsset,
    filteredMethodList,
    addMethod,
  };

  return <PlainAssetRow {...plainProps} />;
};

export default AssetRow;
