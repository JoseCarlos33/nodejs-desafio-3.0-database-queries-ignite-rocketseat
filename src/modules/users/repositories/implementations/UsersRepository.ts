import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    // Complete usando ORM
    const user = await this.repository.createQueryBuilder('user')
      .leftJoinAndSelect('user.games', 'games')
      .where('user.id = :id', { id: user_id })
      .getOneOrFail();
    
    if(!user){
      throw new Error("User not found");
    }

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const query = `
      SELECT *
      FROM users
      ORDER BY first_name ASC
    `;
    const users = await this.repository.query(query); // Complete usando raw query
    
    return users;
  }

  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const firstName = this.capitalizeFirstLetter(first_name);
    const lastName = this.capitalizeFirstLetter(last_name);
    
    const query = `
    SELECT *
    FROM users
    WHERE first_name = '${firstName}' OR last_name = '${lastName}'
    `;
    const users = await this.repository.query(query); // Complete usando raw query
    
    return users;
  }
}
