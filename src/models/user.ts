require('../common/env');
import pool from '../common/database';
import bcrypt from 'bcrypt';

const { BCRYPT_PASSWORD, SALT_ROUNDS } =  process.env;

// User object
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

/**
 * This class is for interacting with the user table in the database
 * 
 * @class UserStore
 */
export class UserStore {
  /**
   * Insert data to users table
   * 
   * @param u: User
   * @returns {User} created user
   */
  async create(u: User): Promise<User> {
    try {
      const conn = await pool.connect();
      const sql = 'INSERT INTO users (id, name, email, password) VALUES($1, $2, $3, $4) RETURNING *';

      // hash the password before save to DB
      const hash = bcrypt.hashSync(
        u.password + BCRYPT_PASSWORD, 
        parseInt(SALT_ROUNDS as string)
      );

      const result = await conn.query(sql, [u.id, u.name, u.email, hash]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (error) {
      console.log(`models/user.ts, create user error. ${error}`);
      throw error;
    }
  };

  /**
   * Get all users from DB
   * 
   * @returns {Array} an array of users
   */
  async list(): Promise<User[]> {
    try {
      const sql = 'select id, name, email from users';
      const conn = await pool.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      console.log(`models/user.ts, get all users error. ${error}`);
      throw error;
    }
  };

  /**
   * Get specified user
   * 
   * @param id: string  // 'id' of an user
   * @returns {User}
   */
  async get(id: string): Promise<User> {
    try {
      const sql = 'select * from users where id = ($1)';
      const conn = await pool.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      console.log(`models/user.ts, get an user error. ${error}`);
      throw error;
    }
  };

  /**
   * Change password of an user
   * @param id: string        // id of user
   * @param password: string  // new password
   * @returns {Boolean}
   */
  async changePassword(id: string, password: string): Promise<Boolean> {
    try {
      // hash the password before save to DB
      const hash = bcrypt.hashSync(
        password + BCRYPT_PASSWORD, 
        parseInt(SALT_ROUNDS as string)
      );
      const sql = 'update users set password = $2 where id = ($1)';
      const conn = await pool.connect();
      await conn.query(sql, [id, hash]);
      conn.release();
      return true;
    } catch (error) {
      console.log(`models/user.ts, change password error. ${error}`);
      throw error;
    }
  };

  /**
   * Delete an user
   * @param id: string  // id of user
   * @returns {Boolean}
   */
  async delete(id: string): Promise<Boolean> {
    try {
      const sql = 'delete from users where id = ($1)';
      const conn = await pool.connect();
      const result = await conn.query(sql, [id]);
      console.log(result);
      conn.release();
      return result.rowCount === 1;
    } catch (error) {
      console.log(`models/user.ts, delete an user error. ${error}`);
      throw error;
    }
  };

  // async authenticate(username: string, password: string): Promise<boolean> {
  //   const conn = await pool.connect();
  //   const sql = 'SELECT password FROM users WHERE username=($1)';
  //   const result = await conn.query(sql, [username]);
  //   if(result.rows.length) {
  //     const user = result.rows[0];
  //     if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password)) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };
};