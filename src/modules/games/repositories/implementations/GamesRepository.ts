import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    // Complete usando query builder
    const games = await this.repository.createQueryBuilder('game')
      .where('LOWER(game.title) LIKE LOWER(:title)', { title: `%${param}%` })
      .getMany();
    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const query = `
      SELECT COUNT(*) AS count
      FROM games
    `;
    const count = await this.repository.query(query); // Complete usando raw query
    return count;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    // Complete usando query builder
    const users = await (await this.repository.createQueryBuilder('game')
      .leftJoinAndSelect('game.users', 'user')
      .where('game.id = :id', { id })
      .getOneOrFail())
    .users;

    return users;
  }
}
