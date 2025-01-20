import {
	ReactNode,
	createContext,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { orderBy, where } from 'firebase/firestore';
import { useFirestoreQuery } from '../../utilities/firebaseUtilities';
import { useTab } from '../../hooks/useData.js';
import {
	PurchaseDataType,
	PurchaseRawDataType,
} from '../../types/purchaseTypes.js';
import { dbNames } from '../../firebase.js';

type PurchaseContextType = {
	purchaseList: PurchaseDataType[];
	categorySet: string[];
	setPurchaseList: (purchaseList: PurchaseDataType[]) => void;
};

// Contextを作成（初期値は空のPurchaseListとダミーのsetPurchaseList関数）
export const PurchaseContext = createContext<PurchaseContextType>({
	purchaseList: [],
	categorySet: [],
	setPurchaseList: () => {},
});

export const PurchaseProvider = memo(
	({ children }: { children: ReactNode }) => {
		const { tabId } = useTab();
		const purchaseQueryConstraints = useMemo(
			() => [orderBy('date'), where('tabId', '==', tabId)],
			[tabId]
		);
		const { documents: purchaseRawList } =
			useFirestoreQuery<PurchaseRawDataType>(
				dbNames.purchase,
				purchaseQueryConstraints,
				true
			);

		const categoryList = purchaseRawList.map(
			(purchase) => purchase.category
		);
		const categorySet = categoryList.filter(
			(item, index) => categoryList.indexOf(item) === index && !!item
		);
		categorySet.push('');

		const [purchaseList, _setPurchaseList] = useState<PurchaseDataType[]>(
			[]
		);

		const setPurchaseList = useCallback(
			(purchaseList: PurchaseDataType[]) => {
				const orderedPurchaseList = purchaseList.sort(
					(a, b) => b.date.getTime() - a.date.getTime()
				);
				_setPurchaseList(orderedPurchaseList);
			},
			[]
		);

		useEffect(() => {
			_setPurchaseList(
				purchaseRawList.map((purchase) => {
					return {
						...purchase,
						date: purchase.date.toDate(),
						payDate: purchase.payDate.toDate(),
					};
				})
			);
		}, [purchaseRawList]);

		const context = useMemo(() => {
			return {
				purchaseList,
				categorySet,
				setPurchaseList,
			};
		}, [categorySet, purchaseList, setPurchaseList]);

		return (
			<PurchaseContext.Provider value={context}>
				{children}
			</PurchaseContext.Provider>
		);
	}
);
