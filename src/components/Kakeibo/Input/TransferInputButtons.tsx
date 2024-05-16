import { Box, Button } from "@mui/material";
import { memo } from "react";

type PlainTransferInputButtonsProps = {
  methodError: string | undefined;
  addTransfer: () => void;
  addTemplate: () => void;
};

const PlainTransferInputButtons = memo(
  ({
    methodError,
    addTransfer,
    addTemplate,
  }: PlainTransferInputButtonsProps): JSX.Element => (
    <Box gap={1} display="flex" flexDirection="column">
      <Button
        sx={{ height: "50%" }}
        variant="contained"
        disabled={!!methodError}
        onClick={addTransfer}
      >
        追加
      </Button>
      <Button
        sx={{ height: "50%" }}
        variant="outlined"
        disabled={!!methodError}
        onClick={addTemplate}
      >
        ボタン化
      </Button>
    </Box>
  )
);

const TransferInputButtons = ({
  methodError,
  addTransfer,
  addTemplate,
}: {
  methodError: string | undefined;
  addTransfer: () => void;
  addTemplate: () => void;
}) => {
  const plainProps = { methodError, addTransfer, addTemplate };
  return <PlainTransferInputButtons {...plainProps} />;
};
export default TransferInputButtons;
