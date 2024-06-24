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
import { addDocAsset } from "../../../firebase";
import { memo, useCallback } from "react";
import { AssetListType } from "../../../types";
import AssetRow from "./AssetRow";
import { useAccount, useAsset, useTab } from "../../../hooks/useData";

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
            <TableCell sx={{ px: 0.5 }} />
            <TableCell sx={{ px: 0.5 }}>名前</TableCell>
            <TableCell sx={{ px: 0.5 }}>残高</TableCell>
            <TableCell sx={{ px: 0.5 }}>最終更新</TableCell>
            <TableCell sx={{ px: 0.5 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {props.assetList.map((asset) => (
            <AssetRow asset={asset} key={asset.id} />
          ))}
          <TableRow>
            <TableCell sx={{ px: 0.5 }} colSpan={2}>
              合計
            </TableCell>
            <TableCell sx={{ px: 0.5 }}>{props.sumAssets}円</TableCell>
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
  const { tabId } = useTab();
  const { Account } = useAccount();

  const addAsset = useCallback(() => {
    if (Account) {
      const userId = Account.id;
      const newAsset = {
        userId: userId,
        name: "",
        balanceLog: [{ timestamp: new Date(), balance: 0 }],
        tabId,
      };
      addDocAsset(newAsset);
    }
  }, [Account, tabId]);

  const plainProps = {
    assetList,
    sumAssets,
    addAsset,
  };

  return <PlainAssetsList {...plainProps} />;
};

export default AssetTable;
