import { ReactNode, createContext, memo, useContext, useMemo } from "react";
import { orderBy } from "firebase/firestore";
import { MethodListType, MethodType } from "../../types.js";
import { useFirestoreQuery } from "../../utilities/firebaseUtilities";

type MethodContextType = {
  methodList: MethodListType[];
};

// Contextを作成（初期値は空のMethodListとダミーのsetMethodList関数）
export const MethodContext = createContext<MethodContextType>({
  methodList: [],
});

export const MethodProvider = memo(
  ({ children }: { children: ReactNode }): JSX.Element => {
    const methodQueryConstraints = useMemo(() => [orderBy("timestamp")], []);
    const { documents: methodList } = useFirestoreQuery<
      MethodType,
      MethodListType
    >("Methods", methodQueryConstraints);

    const context = useMemo(() => {
      return { methodList };
    }, [methodList]);

    return (
      <MethodContext.Provider value={context}>
        {children}
      </MethodContext.Provider>
    );
  }
);

export const useMethod = () => useContext(MethodContext);
