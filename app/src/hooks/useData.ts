import { useContext } from 'react';
import { AssetContext, AssetContextType } from '../components/Context/AssetContext';
import { LogContext, LogContextType } from '../components/Context/LogContext';
import { AccountContext, AccountContextType } from '../components/Context/AccountContext';
import { MethodContext, MethodContextType } from '../components/Context/MethodContext';
import { PurchaseContext, PurchaseContextType } from '../components/Context/PurchaseContext';
import { TabContext, TabContextType } from '../components/Context/TabContext';
import { TaskContext, TaskContextType } from '../components/Context/TaskContext';

export const useAsset = ():AssetContextType => useContext(AssetContext);

export const useLog = ():LogContextType => useContext(LogContext);

export const useAccount = ():AccountContextType => useContext(AccountContext);

export const useMethod = (): MethodContextType => useContext(MethodContext);

export const usePurchase = (): PurchaseContextType => useContext(PurchaseContext);

export const useTab = ():TabContextType => useContext(TabContext);

export const useTask = ():TaskContextType => useContext(TaskContext);
