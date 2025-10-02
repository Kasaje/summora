import bcrypt from "bcrypt";
import { ItransactionCategoryRepository, Iuser, IuserRepository } from "../utils/interface";

export class UserService implements IuserRepository {
  constructor(private userRepository: IuserRepository) {}

  async register(
    transactionCategoryRepository: ItransactionCategoryRepository,
    username: string,
    password: string,
    info: Partial<Iuser>
  ): Promise<void> {
    const user = await this.userRepository.getByUsername(username);

    if (user) throw { message: "Username already exists.", status: 400 };

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await this.userRepository.create({
      ...info,
      username,
      passwordHash,
    });

    const userID = newUser.insertedId.toString();
    await transactionCategoryRepository.initializeDefaultCategories(userID);
  }

  async getByID(id: string): Promise<Iuser | null> {
    return await this.userRepository.getByID(id);
  }

  async getByUsername(username: string) {
    return await this.userRepository.getByUsername(username);
  }

  async create(info: Iuser) {
    return await this.userRepository.create(info);
  }

  async update(username: string, updateInfo: Iuser) {
    await this.userRepository.update(username, updateInfo);
  }

  async delete(username: string) {
    await this.userRepository.delete(username);
  }
}
