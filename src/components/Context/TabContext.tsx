import { ReactNode, createContext, memo, useContext, useMemo } from "react";

const TabContext = createContext<{ tabId: string }>({ tabId: "" });

export const TabProvider = memo(
  ({
    children,
    tabId,
  }: {
    children: ReactNode;
    tabId: string;
  }): JSX.Element => {
    const context = useMemo(() => {
      return { tabId };
    }, [tabId]);
    return (
      <TabContext.Provider value={context}>{children}</TabContext.Provider>
    );
  }
);

export const useTab = () => useContext(TabContext);
