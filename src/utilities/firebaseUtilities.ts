import {
  query,
  collection,
  onSnapshot,
  QueryConstraint,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useMemo, useState } from "react";
import { getAuth } from "firebase/auth";

export const useFirestoreQuery = <T>(
  collectionName: string,
  queryConstraints: QueryConstraint[],
  noUserId?: boolean //一部のuserIdが無い情報を取得するときに使う
) => {
  const [documents, setDocuments] = useState<T[]>([]);
  const auth = useMemo(() => getAuth(), []);

  useEffect(() => {
    if (!auth.currentUser) return;
    const firestoreQuery = query(
      collection(db, collectionName),
      ...(noUserId ? [] : [where("userId", "==", auth.currentUser.uid)]),
      ...queryConstraints
    );
    const unsubscribe = onSnapshot(firestoreQuery, (querySnapshot) => {
      const purchasesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDocuments(purchasesData as T[]);
    });

    return () => {
      unsubscribe();
    };
  }, [auth, collectionName, noUserId, queryConstraints]);
  return { documents, setDocuments };
};
