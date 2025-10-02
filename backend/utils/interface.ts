import { ObjectId } from "mongodb";
import { EtransactionType } from "./enum";

export interface Iuser {
  id: string;
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
  description: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;

  // Relational
  userID: string;
  categoryID: string;
}

export interface ItransactionCategory {
  name: string;
  createdAt: string;
  updatedAt: string;

  // Relational
  userID: string;
}

export interface IbodyLogin {
  username: string;
  password: string;
}

export interface IbodyRegister extends Iuser {
  password: string;
}

export interface IresponseMiddleware {
  id: string;
  username: string;
}

export interface ItransactionCategoryRepository {
  getByID(id: string): Promise<ItransactionCategory | null>;
  initializeDefaultCategories(userID: string): Promise<void>;
  listByUserID(userID: string): Promise<ItransactionCategory[]>;
  create(userID: string, info: Partial<ItransactionCategory>): Promise<void>;
  update(id: string, updateInfo: Partial<ItransactionCategory>): Promise<void>;
  delete(id: string, transactionRepository: ItransactionRepository): Promise<void>;
}

export interface IuserRepository {
  getByID(id: string): Promise<Iuser | null>;
  getByUsername(username: string): Promise<Iuser | null>;
  create(info: Partial<Iuser>): Promise<{ insertedId: ObjectId }>;
  update(username: string, updateInfo: Iuser): Promise<void>;
  delete(username: string): Promise<void>;
}

export interface ItransactionRepository {
  getByID(id: string): Promise<Itransaction | null>;
  listByUserID(
    userID: string,
    transactionCategoryRepository: ItransactionCategoryRepository
  ): Promise<Itransaction[]>;
  listByCategoryID(categoryID: string): Promise<Itransaction[]>;
  create(userID: string, info: Partial<Itransaction>): Promise<void>;
  update(id: string, updateInfo: Partial<Itransaction>): Promise<void>;
  delete(id: string): Promise<void>;
  summary(userID: string): Promise<Isummary>;
}

export interface Isummary {
  income: number;
  expense: number;
  balance: number;
}

export interface IauthService {
  login(username: string, password: string): Promise<IresponseLogin>;
  verifyToken(token: string): Promise<IresponseMiddleware>;
}

export interface IresponseLogin {
  accessToken: string;
  refreshToken: string;
}

export interface IparamCategory {
  params: {
    id: string;
  };
}

export interface IbodyCreateCategory {
  name: string;
}

export interface IbodyUpdateCategory {
  name: string;
}

export interface IparamTransaction {
  params: {
    id: string;
  };
}
