import {
  query,
  collection,
  onSnapshot,
  DocumentData,
  QueryConstraint,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useMemo, useState } from "react";
import { getAuth } from "firebase/auth";

// U = TとすることでUをオプショナルに
export const useFirestoreQuery = <T extends DocumentData, U = T>(
  collectionName: string,
  queryConstraints: QueryConstraint[],
  noUserId?: boolean //一部のuserIdが無い情報を取得するときに使う
) => {
  const [documents, setDocuments] = useState<U[]>([]);
  const auth = useMemo(() => getAuth(), []);

  useEffect(() => {
    const firestoreQuery = query(
      collection(db, collectionName),
      ...(noUserId ? [] : [where("userId", "==", auth.currentUser?.uid)]),
      ...queryConstraints
    );
    const unsubscribe = onSnapshot(firestoreQuery, (querySnapshot) => {
      const purchasesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as T),
      }));
      setDocuments(purchasesData as U[]);
    });

    return () => {
      unsubscribe();
    };
  }, [auth.currentUser?.uid, collectionName, noUserId, queryConstraints]);
  return { documents, setDocuments };
};
