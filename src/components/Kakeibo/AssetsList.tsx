import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
  TableHead,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { addDocAsset } from "../../firebase";
import { getAuth } from "firebase/auth";
import { useAsset } from "../Context/AssetContext";
import { memo, useCallback } from "react";
import { AssetListType } from "../../types";
import AssetRow from "./AssetRow";

type PlainAssetsListProps = {
  assetList: AssetListType[];
  sumAssets: number;
  addAsset: () => void;
};

const PlainAssetsList = memo(
  (props: PlainAssetsListProps): JSX.Element => (
    <TableContainer component={Paper} sx={{ marginY: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>名前</TableCell>
            <TableCell>残高</TableCell>
            <TableCell>変更保存</TableCell>
            <TableCell>削除</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.assetList.map((asset) => (
            <AssetRow asset={asset} key={asset.id} />
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

const AssetTable = () => {
  const { assetList, sumAssets } = useAsset();
  const auth = getAuth();

  const addAsset = useCallback(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const newAsset = {
        userId: userId,
        name: "",
        balance: 0,
      };
      addDocAsset(newAsset);
    }
  }, [auth.currentUser]);

  const plainProps = {
    assetList,
    sumAssets,
    addAsset,
  };

  return <PlainAssetsList {...plainProps} />;
};

export default AssetTable;
