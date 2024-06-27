import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
  TableHead,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { addDocAsset } from "../../../firebase";
import { memo, useCallback } from "react";
import { AssetListType, PurchaseListType } from "../../../types";
import AssetRow from "./AssetRow";
import { useAccount, useAsset, useTab } from "../../../hooks/useData";
import { lastDayOfMonth } from "date-fns";
import { sumSpentAndIncome } from "../../../utilities/purchaseUtilities";
import TableCellWrapper from "../TableCellWrapper";

type PlainAssetsListProps = {
  assetList: AssetListType[];
  sumAssets: number;
  addAsset: () => void;
  methodSpent: { [key: string]: number };
  purchaseSum: number;
};

const PlainAssetsList = memo(
  (props: PlainAssetsListProps): JSX.Element => (
    <TableContainer component={Paper} sx={{ marginY: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCellWrapper />
            <TableCellWrapper label="名前" />
            <TableCellWrapper label="残高" />
            <TableCellWrapper label="月末残高" />
            <TableCellWrapper label="最終更新" />
            <TableCellWrapper />
          </TableRow>
        </TableHead>
        <TableBody>
          {props.assetList.map((asset) => (
            <AssetRow
              asset={asset}
              key={asset.id}
              methodSpent={props.methodSpent[asset.id] ?? 0}
            />
          ))}
          <TableRow>
            <TableCellWrapper label="合計" colSpan={2} />
            <TableCellWrapper label={props.sumAssets + "円"} />
            <TableCellWrapper
              label={props.sumAssets + props.purchaseSum + "円"}
            />
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

const AssetTable = ({
  orderedPurchase,
}: {
  orderedPurchase: PurchaseListType[];
}) => {
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

  // 月末までの支払い方法別支払い合計
  const methodSpent: { [key: string]: number } = {};
  const filteredPurchases = orderedPurchase.filter(
    (purchase) => purchase.date.toDate() < lastDayOfMonth(new Date())
  );
  filteredPurchases.forEach((purchase) => {
    const assetId = purchase.method.assetId;
    const purchasePrice = purchase.income
      ? Number(purchase.price)
      : -Number(purchase.price);
    if (methodSpent[assetId]) {
      methodSpent[assetId] += purchasePrice;
    } else {
      methodSpent[assetId] = purchasePrice;
    }
  });
  const purchaseSum = sumSpentAndIncome(filteredPurchases);

  const plainProps = {
    assetList,
    sumAssets,
    addAsset,
    methodSpent,
    purchaseSum,
  };

  return <PlainAssetsList {...plainProps} />;
};

export default AssetTable;
