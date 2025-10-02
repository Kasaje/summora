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
  category: string;
  description: string;
  amount: number;
  createdAt: string;
  updatedAt: string;

  // Relational
  userID: string;
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
  initializeDefaultCategories(userID: string): Promise<void>;
  listByUserID(userID: string): Promise<ItransactionCategory[]>;
  create(userID: string, info: ItransactionCategory): Promise<void>;
  update(id: string, updateInfo: ItransactionCategory): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IuserRepository {
  getByUsername(username: string): Promise<Iuser | null>;
  create(info: Iuser): Promise<{ insertedId: ObjectId }>;
  update(username: string, updateInfo: Iuser): Promise<void>;
  delete(username: string): Promise<void>;
}

export interface IauthService {
  login(username: string, password: string): Promise<IresponseLogin>;
  verifyToken(token: string): Promise<IresponseMiddleware>;
}

export interface IresponseLogin {
  accessToken: string;
  refreshToken: string;
}
