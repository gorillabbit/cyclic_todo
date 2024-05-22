import { Tabs, Tab, Box } from "@mui/material";
import { memo, useCallback } from "react";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";

type HeaderTabsProps = {
  tabValue: number;
  setTabValue: React.Dispatch<React.SetStateAction<number>>;
  pinnedTabNum: any;
  setPinnedTab: (name: "pinnedTab", value: any) => void;
};

type PlainHeaderTabsProps = Omit<HeaderTabsProps, "setPinnedTab"> & {
  tabs: {
    name: string;
    num: number;
  }[];
  handlePinClick: (tabNumber: number) => void;
  pinnedTabNum: any;
};

const PlainHeaderTabs = memo(
  ({
    tabs,
    tabValue,
    setTabValue,
    handlePinClick,
    pinnedTabNum,
  }: PlainHeaderTabsProps): JSX.Element => (
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
  )
);

const HeaderTabs = ({
  pinnedTabNum,
  setPinnedTab,
  tabValue,
  setTabValue,
}: HeaderTabsProps) => {
  const tabs = [
    { name: "タスク/ログ", num: 0 },
    { name: "家計簿", num: 1 },
  ];
  const handlePinClick = useCallback(
    (tabNumber: number) => {
      setPinnedTab("pinnedTab", tabNumber);
    },
    [setPinnedTab]
  );

  const plainProps = {
    tabs,
    tabValue,
    setTabValue,
    handlePinClick,
    pinnedTabNum,
  };
  return <PlainHeaderTabs {...plainProps} />;
};

export default HeaderTabs;
