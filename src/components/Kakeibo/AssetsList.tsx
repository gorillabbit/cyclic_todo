import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  IconButton,
  TableHead,
  Button,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { addDocAsset, deleteDocAsset, updateDocAsset } from "../../firebase";
import { getAuth } from "firebase/auth";
import { useAsset } from "../Context/AssetContext";
import { memo, useCallback } from "react";
import { AssetInputType } from "../../types";

type PlainAssetsListProps = {
  assetList: AssetInputType[];
  sumAssets: number;
  removeAsset: (id: string) => void;
  saveChanges: (id: string) => void;
  addAsset: () => void;
  handleBalanceChange: (id: string, newBalance: number) => void;
  handleNameChange: (id: string, newName: string) => void;
};

const PlainAssetsList = memo(
  (props: PlainAssetsListProps): JSX.Element => (
    <TableContainer component={Paper} sx={{ marginY: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>名前</TableCell>
            <TableCell>残高</TableCell>
            <TableCell>変更保存</TableCell>
            <TableCell>削除</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.assetList.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>
                <TextField
                  variant="outlined"
                  value={asset.tempName ?? asset.name}
                  onChange={(e) =>
                    props.handleNameChange(asset.id, e.target.value)
                  }
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  variant="outlined"
                  value={asset.tempBalance ?? asset.balance}
                  onChange={(e) =>
                    props.handleBalanceChange(
                      asset.id,
                      parseFloat(e.target.value) || 0
                    )
                  }
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!(asset.tempBalance || asset.tempName)}
                  onClick={() => props.saveChanges(asset.id)}
                >
                  変更
                </Button>
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => props.removeAsset(asset.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>合計</TableCell>
            <TableCell>{props.sumAssets}円</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <IconButton
        onClick={props.addAsset}
        color="primary"
        aria-label="add asset"
      >
        <AddCircleOutlineIcon />
      </IconButton>
    </TableContainer>
  )
);

const auth = getAuth();

const AssetTable = () => {
  const { assetList, setAssetList, sumAssets } = useAsset();

  const handleNameChange = useCallback(
    (id: string, newName: string): void => {
      setAssetList(
        assetList.map((asset) =>
          asset.id === id ? { ...asset, tempName: newName } : asset
        )
      );
    },
    [assetList, setAssetList]
  );

  const handleBalanceChange = useCallback(
    (id: string, newBalance: number): void => {
      setAssetList(
        assetList.map((asset) =>
          asset.id === id ? { ...asset, tempBalance: newBalance } : asset
        )
      );
    },
    [assetList, setAssetList]
  );

  const saveChanges = useCallback(
    (id: string): void => {
      const asset = assetList.find((asset) => asset.id === id);
      if (asset) {
        const updatedData = {
          name: asset.tempName || asset.name,
          balance: asset.tempBalance || asset.balance,
        };
        updateDocAsset(id, updatedData);
        // ローカルステートの tempName と tempBalance をクリア
        setAssetList(
          assetList.map((asset) =>
            asset.id === id
              ? {
                  ...asset,
                  ...updatedData,
                  tempName: undefined,
                  tempBalance: undefined,
                }
              : asset
          )
        );
      }
    },
    [assetList, setAssetList]
  );

  const addAsset = useCallback((): void => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const newAsset = {
        userId: userId,
        name: "",
        balance: 0,
      };
      addDocAsset(newAsset);
    }
  }, []);

  const removeAsset = useCallback((id: string): void => {
    deleteDocAsset(id);
  }, []);

  const plainProps = {
    assetList,
    sumAssets,
    removeAsset,
    saveChanges,
    addAsset,
    handleBalanceChange,
    handleNameChange,
  };

  return <PlainAssetsList {...plainProps} />;
};

export default AssetTable;
