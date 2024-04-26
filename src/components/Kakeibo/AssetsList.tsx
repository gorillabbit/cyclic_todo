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

const auth = getAuth();

const AssetTable = () => {
  const { assetList, setAssetList, sumAssets } = useAsset();

  const handleNameChange = (id: string, newName: string): void => {
    setAssetList(
      assetList.map((asset) =>
        asset.id === id ? { ...asset, tempName: newName } : asset
      )
    );
  };

  const handleBalanceChange = (id: string, newBalance: number): void => {
    setAssetList(
      assetList.map((asset) =>
        asset.id === id ? { ...asset, tempBalance: newBalance } : asset
      )
    );
  };

  const saveChanges = (id: string): void => {
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
  };

  const addAsset = (): void => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const newAsset = {
        userId: userId,
        name: "",
        balance: 0,
      };
      addDocAsset(newAsset);
    }
  };

  const removeAsset = (id: string): void => {
    deleteDocAsset(id);
  };

  return (
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
          {assetList.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>
                <TextField
                  variant="outlined"
                  value={asset.tempName ?? asset.name}
                  onChange={(e) => handleNameChange(asset.id, e.target.value)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  variant="outlined"
                  value={asset.tempBalance ?? asset.balance}
                  onChange={(e) =>
                    handleBalanceChange(
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
                  onClick={() => saveChanges(asset.id)}
                >
                  変更
                </Button>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => removeAsset(asset.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>合計</TableCell>
            <TableCell>{sumAssets}円</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <IconButton onClick={addAsset} color="primary" aria-label="add asset">
        <AddCircleOutlineIcon />
      </IconButton>
    </TableContainer>
  );
};

export default AssetTable;
