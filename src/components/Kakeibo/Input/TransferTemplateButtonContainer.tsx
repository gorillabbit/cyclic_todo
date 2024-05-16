import { Box } from "@mui/material";
import { memo, useMemo } from "react";
import { InputTransferType, TransferType } from "../../../types";
import { orderBy } from "firebase/firestore";
import { useFirestoreQuery } from "../../../utilities/firebaseUtilities";
import { dbNames } from "../../../firebase";
import TransferTemplateButton from "./TransferTemplateButton";

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
            transfer={transfer}
            setNewTransfer={setNewTransfer}
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
  const purchaseTemplatesQueryConstraints = useMemo(
    () => [orderBy("timestamp", "desc")],
    []
  );
  const { documents: transfers } = useFirestoreQuery<
    InputTransferType,
    TransferType
  >(dbNames.transferTemplate, purchaseTemplatesQueryConstraints);

  const plainProps = {
    transfers,
    setNewTransfer,
  };
  return <PlainTemplateButtonsContainer {...plainProps} />;
};

export default TransferTemplateButtonsContainer;
