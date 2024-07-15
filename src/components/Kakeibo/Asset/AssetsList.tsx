import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
  TableHead,
  TableCell,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { addDocAsset, addDocAssetLog } from "../../../firebase";
import { memo, useCallback, useState } from "react";
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
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  filteredPurchases: PurchaseListType[];
};

const PlainAssetsList = memo(
  (props: PlainAssetsListProps): JSX.Element => (
    <TableContainer component={Paper} sx={{ marginY: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="none">
              <IconButton onClick={() => props.setIsOpen(!props.isOpen)}>
                {props.isOpen ? (
                  <CloseFullscreenIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </TableCell>
            {props.isOpen ? (
              <>
                <TableCellWrapper label="名前" />
                <TableCellWrapper label="残高" />
                <TableCellWrapper label="月末残高" />
                <TableCellWrapper />
              </>
            ) : (
              <TableCellWrapper label="資産を開く" colSpan={5} />
            )}
          </TableRow>
        </TableHead>
        {props.isOpen && (
          <TableBody>
            {props.assetList.map((asset, index) => (
              <AssetRow
                asset={asset}
                key={index}
                filteredPurchases={props.filteredPurchases}
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
        )}
      </Table>
      {props.isOpen && (
        <IconButton
          onClick={props.addAsset}
          color="primary"
          aria-label="add asset"
        >
          <AddCircleOutlineIcon />
        </IconButton>
      )}
    </TableContainer>
  )
);

const AssetTable = memo(
  ({ orderedPurchase }: { orderedPurchase: PurchaseListType[] }) => {
    const { assetList, sumAssets } = useAsset();
    const { tabId } = useTab();
    const { Account } = useAccount();
    const [isOpen, setIsOpen] = useState(false);

    const addAsset = useCallback(() => {
      if (Account) {
        const userId = Account.id;
        const newAssetLog = {
          userId,
          tabId,
          name: "",
          balanceLog: [
            {
              timestamp: new Date(),
              balance: 0,
            },
          ],
        };
        addDocAsset(newAssetLog).then((result) => {
          addDocAssetLog({
            assetId: result.id,
            methodId: "",
            balance: 0,
            date: new Date(),
          });
        });
      }
    }, [Account, tabId]);

    // 月末までの支払い方法別支払い合計
    const methodSpent: { [key: string]: number } = {};
    const filteredPurchases = orderedPurchase.filter((purchase) => {
      // 最後の資産の更新日付から月末までの購入を抽出
      const lastAssetBalance = assetList
        .find((asset) => asset.id == purchase.method.assetId)
        ?.balanceLog.slice(-1)[0];
      if (!lastAssetBalance) {
        return false;
      }
      const lastAssetDate = lastAssetBalance.timestamp.toDate();
      if (lastAssetDate) {
        return purchase.date.toDate() < lastDayOfMonth(new Date());
      }
    });
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
      isOpen,
      setIsOpen,
      filteredPurchases,
    };

    return <PlainAssetsList {...plainProps} />;
  }
);

export default AssetTable;
