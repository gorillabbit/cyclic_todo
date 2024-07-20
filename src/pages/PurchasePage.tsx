import { Box } from "@mui/material";
import { memo } from "react";
import { useIsSmall } from "../hooks/useWindowSize";
import { AssetProvider } from "../components/Context/AssetContext";
import { MethodProvider } from "../components/Context/MethodContext";
import { PurchaseProvider } from "../components/Context/PurchaseContext";
import Purchases from "../components/Kakeibo/PurchasesTable/Purchases";
import PurchaseInputs from "../components/Kakeibo/Input/InputsContainer";

type PlainPurchasePageProps = {
  isSmall: boolean;
};

const PlainPurchasePage = memo(({ isSmall }: PlainPurchasePageProps) => {
  return (
    <MethodProvider>
      <PurchaseProvider>
        <AssetProvider>
          <Box m={2}>
            <PurchaseInputs />
          </Box>
          <Box m={isSmall ? 0 : 2}>
            <Purchases />
          </Box>
        </AssetProvider>
      </PurchaseProvider>
    </MethodProvider>
  );
});

const PurchasePage = memo(() => {
  const isSmall = useIsSmall();
  const plainProps = { isSmall };
  return <PlainPurchasePage {...plainProps} />;
});

export default PurchasePage;
