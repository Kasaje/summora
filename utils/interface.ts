import { EtransactionType } from "./enum";

export interface Iuser {
  username: string;
  name: string;
  passwordHash: string;
  isLogin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Itransaction {
  type: EtransactionType;
  date: string;
  category: string;
  description: string;
  amount: number;
  createdAt: string;
  updatedAt: string;

  // Relational
  userId: string;
}

export interface ItransactionCategory {
  name: string;
  createdAt: string;
  updatedAt: string;

  // Relational
  userId: string;
}
