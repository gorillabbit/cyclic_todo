import { Box } from "@mui/material";
import { memo, useMemo } from "react";
import { InputTransferType, TransferType } from "../../../types";
import { orderBy, where } from "firebase/firestore";
import { useFirestoreQuery } from "../../../utilities/firebaseUtilities";
import { dbNames } from "../../../firebase";
import TransferTemplateButton from "./TransferTemplateButton";
import { useTab } from "../../../hooks/useData";

type PlainTemplateButtonsContainerProps = {
  transfers: TransferType[];
  setNewTransfer: React.Dispatch<React.SetStateAction<InputTransferType>>;
};

const PlainTemplateButtonsContainer = memo(
  ({
    transfers,
    setNewTransfer,
  }: PlainTemplateButtonsContainerProps): JSX.Element => (
    <>
      <Box m={0.5}>
        {transfers.map((transfer) => (
          <TransferTemplateButton
            {...{ transfer, setNewTransfer }}
            key={transfer.id}
          />
        ))}
      </Box>
    </>
  )
);

const TransferTemplateButtonsContainer = ({
  setNewTransfer,
}: {
  setNewTransfer: React.Dispatch<React.SetStateAction<InputTransferType>>;
}) => {
  const { tabId } = useTab();
  const purchaseTemplatesQueryConstraints = useMemo(
    () => [orderBy("timestamp", "desc"), where("tabId", "==", tabId)],
    [tabId]
  );
  const { documents: transfers } = useFirestoreQuery<TransferType>(
    dbNames.transferTemplate,
    purchaseTemplatesQueryConstraints,
    true
  );

  const plainProps = {
    transfers,
    setNewTransfer,
  };
  return <PlainTemplateButtonsContainer {...plainProps} />;
};

export default TransferTemplateButtonsContainer;
