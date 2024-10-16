import { Box } from "@mui/material";
import { memo, useMemo } from "react";
import { TransferType } from "../../../types";
import { orderBy, where } from "firebase/firestore";
import { useFirestoreQuery } from "../../../utilities/firebaseUtilities";
import { dbNames } from "../../../firebase";
import TransferTemplateButton from "./TransferTemplateButton";
import { useTab } from "../../../hooks/useData";

type PlainTemplateButtonsContainerProps = {
  transfers: TransferType[];
  useTemplate: (transfer: TransferType) => void;
};

const PlainTemplateButtonsContainer = memo(
  ({
    transfers,
    useTemplate,
  }: PlainTemplateButtonsContainerProps): JSX.Element => (
    <Box m={0.5}>
      {transfers.map((transfer) => (
        <TransferTemplateButton
          transfer={transfer}
          useTemplate={useTemplate}
          key={transfer.id}
        />
      ))}
    </Box>
  )
);

const TransferTemplateButtonsContainer = ({
  useTemplate,
}: {
  useTemplate: (transfer: TransferType) => void;
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
    useTemplate,
  };
  return <PlainTemplateButtonsContainer {...plainProps} />;
};

export default TransferTemplateButtonsContainer;
