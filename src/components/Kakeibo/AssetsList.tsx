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
            <TableCell sx={{ paddingX: 0.5 }}></TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>名前</TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>残高</TableCell>
            <TableCell sx={{ paddingX: 0.5 }} colSpan={3} />
          </TableRow>
        </TableHead>
        <TableBody>
          {props.assetList.map((asset) => (
            <AssetRow asset={asset} key={asset.id} />
          ))}
          <TableRow>
            <TableCell sx={{ paddingX: 0.5 }}>合計</TableCell>
            <TableCell sx={{ paddingX: 0.5 }}>{props.sumAssets}円</TableCell>
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
        balanceLog: [{ timestamp: new Date(), balance: 0 }],
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
