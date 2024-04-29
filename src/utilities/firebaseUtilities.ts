import {
  query,
  collection,
  onSnapshot,
  DocumentData,
  QueryConstraint,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { getAuth } from "firebase/auth";

// U = TとすることでUをオプショナルに
export const useFirestoreQuery = <T extends DocumentData, U = T>(
  collectionName: string,
  queryConstraints: QueryConstraint[],
  noUserId?: boolean //一部のuserIdが無い情報を取得するときに使う
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [documents, setDocuments] = useState<U[]>([]);
  const auth = useMemo(() => getAuth(), []);
  // 無駄な取得が発生していないか監視するために表示する
  console.log("useFirestoreQuery", collectionName, queryConstraints);

  useEffect(() => {
    const fetchData = () => {
      const firestoreQuery = query(
        collection(db, collectionName),
        ...(noUserId ? [] : [where("userId", "==", auth.currentUser?.uid)]),
        ...queryConstraints
      );
      return onSnapshot(
        firestoreQuery,
        (querySnapshot) => {
          const purchasesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as T),
          }));
          setDocuments(purchasesData as U[]);
          setLoading(false);
        },
        (err: SetStateAction<Error | null>) => {
          console.error("Firestore query error:", err);
          setError(err);
          setLoading(false);
        }
      );
    };
    return () => {
      fetchData();
    };
  }, [auth.currentUser?.uid, collectionName, noUserId, queryConstraints]);
  return { documents, setDocuments, loading, error };
};
