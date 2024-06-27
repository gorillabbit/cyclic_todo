import { Box, Button } from "@mui/material";
import { memo } from "react";

type TransferInputButtonsProps = {
  methodError: string | undefined;
  addTransfer: () => void;
  addTemplate: () => void;
};

type PlainTransferInputButtonsProps = TransferInputButtonsProps;

const PlainTransferInputButtons = memo(
  ({
    methodError,
    addTransfer,
    addTemplate,
  }: PlainTransferInputButtonsProps): JSX.Element => (
    <Box gap={1} display="flex" mt={1}>
      <Button
        sx={{ width: "50%" }}
        variant="contained"
        disabled={!!methodError}
        onClick={addTransfer}
      >
        追加
      </Button>
      <Button
        sx={{ width: "50%" }}
        variant="outlined"
        disabled={!!methodError}
        onClick={addTemplate}
      >
        ボタン化
      </Button>
    </Box>
  )
);

const TransferInputButtons = (props: TransferInputButtonsProps) => {
  return <PlainTransferInputButtons {...props} />;
};
export default TransferInputButtons;
