import {
  Tabs,
  Tab,
  Box,
  IconButton,
  Dialog,
  MenuItem,
  Select,
  Button,
  TextField,
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import AddIcon from "@mui/icons-material/Add";
import { addDocTab } from "../firebase";
import { getAuth } from "firebase/auth";

type HeaderTabsProps = {
  tabValue: number;
  setTabValue: React.Dispatch<React.SetStateAction<number>>;
  pinnedTabNum: any;
  setPinnedTab: (name: "pinnedTab", value: any) => void;
  tabs: {
    name: string;
    num: number;
    type: string;
  }[];
};

type PlainHeaderTabsProps = Omit<
  HeaderTabsProps,
  "setPinnedTab" | "tabList"
> & {
  tabs: {
    name: string;
    num: number;
  }[];
  handlePinClick: (tabNumber: number) => void;
  pinnedTabNum: any;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  addTabType: "task" | "purchase";
  setAddTabType: React.Dispatch<React.SetStateAction<"task" | "purchase">>;
  onSaveButtonClick: () => void;
  addTabName: string;
  setAddTabName: React.Dispatch<React.SetStateAction<string>>;
};

const PlainHeaderTabs = memo(
  ({
    tabs,
    tabValue,
    setTabValue,
    handlePinClick,
    pinnedTabNum,
    openDialog,
    setOpenDialog,
    addTabType,
    setAddTabType,
    onSaveButtonClick,
    addTabName,
    setAddTabName,
  }: PlainHeaderTabsProps): JSX.Element => (
    <Box display="flex">
      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
        {tabs.map((tab) => (
          <Tab
            key={tab.name}
            icon={
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  handlePinClick(tab.num);
                }}
              >
                {pinnedTabNum === tab.num ? (
                  <PushPinRoundedIcon />
                ) : (
                  <PushPinOutlinedIcon />
                )}
              </Box>
            }
            iconPosition="start"
            label={tab.name}
          />
        ))}
      </Tabs>
      <IconButton onClick={() => setOpenDialog(true)}>
        <AddIcon />
      </IconButton>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          m={2}
          gap={1}
        >
          追加するタブを選択してください
          <TextField
            label="タブ名"
            value={addTabName}
            onChange={(e) => setAddTabName(e.target.value)}
          />
          <Select
            value={addTabType}
            onChange={(e) =>
              setAddTabType(e.target.value as "task" | "purchase")
            }
          >
            <MenuItem value="task">タスク/ログ</MenuItem>
            <MenuItem value="purchase">家計簿</MenuItem>
          </Select>
          <Box display="flex" gap={1}>
            <Button color="error" onClick={() => setOpenDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={onSaveButtonClick}>確定</Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
);

const HeaderTabs = ({
  pinnedTabNum,
  setPinnedTab,
  tabValue,
  setTabValue,
  tabs,
}: HeaderTabsProps) => {
  const auth = getAuth();
  const handlePinClick = useCallback(
    (tabNumber: number) => {
      setPinnedTab("pinnedTab", tabNumber);
    },
    [setPinnedTab]
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [addTabType, setAddTabType] = useState<"task" | "purchase">("task");
  const [addTabName, setAddTabName] = useState("");
  const onSaveButtonClick = () => {
    setOpenDialog(false);
    if (auth.currentUser && addTabName) {
      addDocTab({
        name: addTabName,
        type: addTabType,
        sharedAccountsId: [],
        userId: auth.currentUser?.uid,
      });
    }
  };

  const plainProps = {
    tabs,
    tabValue,
    setTabValue,
    handlePinClick,
    pinnedTabNum,
    openDialog,
    setOpenDialog,
    addTabType,
    setAddTabType,
    onSaveButtonClick,
    addTabName,
    setAddTabName,
  };
  return <PlainHeaderTabs {...plainProps} />;
};

export default HeaderTabs;
