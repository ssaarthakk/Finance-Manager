import { TransactionType } from './transaction';

export interface Category {
  id: string;
  userId?: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}
