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
import { addDocAsset } from "../../../firebase";
import { memo, useCallback, useState } from "react";
import { AssetListType } from "../../../types";
import AssetRow from "./AssetRow";
import { useAccount, useAsset, useTab } from "../../../hooks/useData";
import { lastDayOfMonth } from "date-fns";
import { sumSpentAndIncome } from "../../../utilities/purchaseUtilities";
import TableCellWrapper from "../TableCellWrapper";
import { PurchaseDataType } from "../../../types/purchaseTypes";

type PlainAssetsListProps = {
  assetList: AssetListType[];
  addAsset: () => void;
  methodSpent: { [key: string]: number };
  purchaseSum: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  filteredPurchases: PurchaseDataType[];
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
  ({ orderedPurchase }: { orderedPurchase: PurchaseDataType[] }) => {
    const { assetList } = useAsset();
    const { tabId } = useTab();
    const { Account } = useAccount();
    const [isOpen, setIsOpen] = useState(false);

    // TODO 追加時に「残高調整」というメソッドを自動でつくる
    const addAsset = useCallback(() => {
      if (!Account) return;
      const newAssetLog = {
        userId: Account.id,
        tabId,
        name: "",
      };
      addDocAsset(newAssetLog);
    }, [Account, tabId]);

    // 月末までの支払い方法別支払い合計
    // TODO 最も最近の先月の支払いと今月の最後の支払いの残高の差額を見る
    const methodSpent: { [key: string]: number } = {};
    const filteredPurchases = orderedPurchase.filter((purchase) => {
      // 最後の資産の更新日付から月末までの購入を抽出
      const lastAssetBalance = assetList.find(
        (asset) => asset.id == purchase.method.assetId
      );

      if (!lastAssetBalance) return false;

      const lastAssetDate = lastAssetBalance.timestamp.toDate();
      if (lastAssetDate) {
        return purchase.date < lastDayOfMonth(new Date());
      }
    });
    filteredPurchases.forEach((purchase) => {
      const assetId = purchase.method.assetId;
      const purchasePrice = purchase.difference;
      if (methodSpent[assetId]) {
        methodSpent[assetId] += purchasePrice;
      } else {
        methodSpent[assetId] = purchasePrice;
      }
    });
    const purchaseSum = sumSpentAndIncome(filteredPurchases);

    const plainProps = {
      assetList,
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
