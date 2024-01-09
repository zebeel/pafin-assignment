require('../common/env');
import express, { Request, Response } from 'express';
import { UserStore } from '../models/user';
import { v4 as uuidv4 } from 'uuid';
import { verifyAuthToken } from '../middlewares/verifyToken';
import { ResponseSuccess, ResponseError, ResponseFailed } from '../common/apiResponse';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

const store = new UserStore();

/**
 * Create a new user with the following input:
 * {
 *    name: string,     // non-empty string, max length 30
 *    email: string,    // non-empty string following the email format
 *    password: string  // non-empty string, length from 8 to 20
 * }
 * @param req HTTP Request Object
 * @param res HTTP Response Object
 */
const create = async (req: Request, res: Response) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array();
      const response = new ResponseFailed('Validation failed. Please check your input.', errors);
      res.status(200).json(response);
      return;
    }

    const { name, email, password } = req.body;
    const user = await store.create({ id: uuidv4(), name, email, password });
    const response = new ResponseSuccess(user);
    res.status(200).json(response);
  } catch (error) {
    console.error(`create user error. ${error}`);
    const response = new ResponseError('System error, please try again later.');
    res.status(200).json(response);
  }
};

/**
 * Get all users from DB
 * 
 * @param req HTTP Request Object
 * @param res HTTP Response Object
 */
const list = async (req: Request, res: Response) => {
  try {
    const users = await store.list();
    const response = new ResponseSuccess(users);
    res.status(200).json(response);
  } catch (error) {
    console.error(`get user list error. ${error}`);
    const response = new ResponseError('System error, please try again later.');
    res.status(200).json(response);
  }
};

/**
 * Get an user
 * The parameter 'id' is required, and it should be the 'id' of an existing user; otherwise, a failed response will be returned.
 * 
 * @param req HTTP Request Object
 * @param res HTTP Response Object
 */
const get = async (req: Request, res: Response) => {
  try {
    const user = await store.get(req.params.id);
    if (user) {
      const response = new ResponseSuccess(user);
      res.status(200).json(response);
    } else {
      const response = new ResponseFailed('User does not exist.');
      res.status(200).json(response);
    }
  } catch (error) {
    console.error(`get user error. ${error}`);
    const response = new ResponseError('System error, please try again later.');
    res.status(200).json(response);
  }
};

/**
 * Change user's password with the following input:
 * {
 *    currentPassword: string,  // the current password of user
 *    newPassword: string,      // the new password of user
 * }
 * The 'currentPassword' & 'newPassword' must follow the password field rule and not be the same
 * The parameter 'id' is required, and it should be the 'id' of an existing user; otherwise, a failed response will be returned.
 * The 'currentPassword' must match the password of the user with the specified 'id' in the 'id' parameter
 * 
 * @param req HTTP Request Object
 * @param res HTTP Response Object
 */
const changePassword = async (req: Request, res: Response) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array();
      const response = new ResponseFailed('Validation failed. Please check your input.', errors);
      res.status(200).json(response);
      return;
    }

    const id = req.params.id;
    const user = await store.get(id);
    if (!user) {
      const response = new ResponseFailed('User does not exist.');
      res.status(200).json(response);
      return;
    }
    const { currentPassword, newPassword } = req.body;
    const { BCRYPT_PASSWORD } =  process.env;
    
    if (!bcrypt.compareSync(currentPassword + BCRYPT_PASSWORD, user.password)) {
      const response = new ResponseFailed('The current password does not match.');
      res.status(200).json(response);
      return;
    }

    await store.changePassword(id, newPassword);
    const response = new ResponseSuccess();
    res.status(200).json(response);
  } catch (error) {
    console.error(`change password error. ${error}`);
    const response = new ResponseError('System error, please try again later.');
    res.status(200).json(response);
  }
};

/**
 * Delete an user
 * The parameter 'id' is required, and it should be the 'id' of an existing user; otherwise, a failed response will be returned.
 * 
 * @param req HTTP Request Object
 * @param res HTTP Response Object
 */
const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await store.delete(req.params.id);
    if (result) {
      const response = new ResponseSuccess();
      res.status(200).json(response);
    } else {
      const response = new ResponseFailed('User does not exist.');
      res.status(200).json(response);
    }
  } catch (error) {
    console.error(`get user error. ${error}`);
    const response = new ResponseError('System error, please try again later.');
    res.status(200).json(response);
  }
};

// Validation rule for creating a user
const validateCreateUser = [
  body('name', 'Name is empty').notEmpty(),
  body('name', 'The length of name is between 1 ~ 30').isLength({ min: 1, max: 30 }),
  body('email', 'Invalid email format').isEmail(),
  body('password', 'Password is empty').notEmpty(),
  body('password', 'The length of password is between 8 ~ 20').isLength({ min: 8, max: 20 }),
]

// Validation rule for password changes
const validateChangePassword = [
  body('currentPassword', 'Current password is empty').notEmpty(),
  body('currentPassword', 'The length of current password is between 8 ~ 20').isLength({ min: 8, max: 20 }),
  body('newPassword', 'New password is empty').notEmpty(),
  body('newPassword', 'The length of new password is between 8 ~ 20').isLength({ min: 8, max: 20 }),
  body('newPassword', 'The new password is the same as the current password').custom((value, { req }) => {
    return value !== req.body.currentPassword;
  })
];

// Declare the routes related to users
const userRoutes = (app: express.Application) => {
  // Get all users
  app.get('/users', verifyAuthToken, list);
  // Retrieve a specified user
  app.get('/user/:id', verifyAuthToken, get);
  // Add a new user
  app.post('/user/add', verifyAuthToken, validateCreateUser, create);
  // Change an user's password
  app.put('/user/change-password/:id', verifyAuthToken, validateChangePassword, changePassword);
  // Delete an user
  app.delete('/user/delete/:id', verifyAuthToken, deleteUser);
};

export default userRoutes;