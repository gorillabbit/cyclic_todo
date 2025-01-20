import { useContext } from 'react';
import { AssetContext } from '../components/Context/AssetContext';
import { LogContext } from '../components/Context/LogContext';
import { AccountContext } from '../components/Context/AccountContext';
import { MethodContext } from '../components/Context/MethodContext';
import { PurchaseContext } from '../components/Context/PurchaseContext';
import { TabContext } from '../components/Context/TabContext';
import { TaskContext } from '../components/Context/TaskContext';

export const useAsset = () => useContext(AssetContext);

export const useLog = () => useContext(LogContext);

export const useAccount = () => useContext(AccountContext);

export const useMethod = () => useContext(MethodContext);

export const usePurchase = () => useContext(PurchaseContext);

export const useTab = () => useContext(TabContext);

export const useTask = () => useContext(TaskContext);
