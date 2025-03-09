import { useContext } from 'react';
import { MethodContext, MethodContextType } from '../components/Context/MethodContext';
import { PurchaseContext, PurchaseContextType } from '../components/Context/PurchaseContext';
import { TabContext, TabContextType } from '../components/Context/TabContext';
import { TaskContext, TaskContextType } from '../components/Context/TaskContext';

export const useMethod = (): MethodContextType => useContext(MethodContext);

export const usePurchase = (): PurchaseContextType => useContext(PurchaseContext);

export const useTab = ():TabContextType => useContext(TabContext);

export const useTask = ():TaskContextType => useContext(TaskContext);
