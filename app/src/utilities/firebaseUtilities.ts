import { query, collection, onSnapshot, QueryConstraint, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

// TODO すべてのTimestamp型をDate型に変換する
export const useFirestoreQuery = <T>(
    collectionName: string,
    queryConstraints: QueryConstraint[],
    nouser_id?: boolean // 一部のuser_idが無い情報を取得するときに使う
) => {
    const [documents, setDocuments] = useState<T[]>([]);
    const [authUser, setAuthUser] = useState(() => getAuth().currentUser);

    // Memoize the authUser state update callback
    const handleAuthStateChanged = useCallback((user: User | null) => {
        setAuthUser(user);
    }, []);

    // Memoize the Firestore query
    const firestoreQuery = useMemo(() => {
        if (!authUser && !nouser_id) return null;

        return query(
            collection(db, collectionName),
            ...(nouser_id ? [] : [where('user_id', '==', authUser?.uid)]),
            ...queryConstraints
        );
    }, [authUser, collectionName, nouser_id, queryConstraints]);

    // Subscribe to auth state changes once
    useEffect(() => {
        const auth = getAuth();
        const unsubscribeAuth = onAuthStateChanged(auth, handleAuthStateChanged);

        return () => {
            unsubscribeAuth();
        };
    }, [handleAuthStateChanged]);

    // Subscribe to Firestore query changes
    useEffect(() => {
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

    // 手動でデータを再取得する関数
    const refetchDocuments = useCallback(async () => {
        if (!firestoreQuery) return;

        const querySnapshot = await getDocs(firestoreQuery);
        const purchasesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setDocuments(purchasesData as T[]);
    }, [firestoreQuery]);

    return { documents, setDocuments, refetchDocuments };
};
