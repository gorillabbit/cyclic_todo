import {
  query,
  collection,
  onSnapshot,
  QueryConstraint,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useMemo, useState, useCallback, SetStateAction } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export const useFirestoreQuery = <T>(
  collectionName: string,
  queryConstraints: QueryConstraint[],
  noUserId?: boolean //一部のuserIdが無い情報を取得するときに使う
) => {
  const [documents, setDocuments] = useState<T[]>([]);
  const [authUser, setAuthUser] = useState(() => getAuth().currentUser);

  // Memoize the authUser state update callback
  const handleAuthStateChanged = useCallback(
    (user: SetStateAction<User | null>) => {
      setAuthUser(user);
    },
    []
  );

  // Memoize the Firestore query
  const firestoreQuery = useMemo(() => {
    if (!authUser && !noUserId) return null;

    return query(
      collection(db, collectionName),
      ...(noUserId ? [] : [where("userId", "==", authUser?.uid)]),
      ...queryConstraints
    );
  }, [authUser, collectionName, noUserId, queryConstraints]);

  // Subscribe to auth state changes once
  useMemo(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, handleAuthStateChanged);

    return () => {
      unsubscribeAuth();
    };
  }, [handleAuthStateChanged]);

  // Subscribe to Firestore query changes
  useMemo(() => {
    if (!firestoreQuery) return;

    const unsubscribeFirestore = onSnapshot(firestoreQuery, (querySnapshot) => {
      const purchasesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDocuments(purchasesData as T[]);
    });

    return () => {
      unsubscribeFirestore();
    };
  }, [firestoreQuery]);

  return { documents, setDocuments };
};
