require('../common/env');
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const { JWT_SECRET} =  process.env;

// Declaration merging to extend Request object with a `jwtPayload` field
declare global {
  namespace Express {
    interface Request {
      jwtPayload?: JwtPayload;
    }
  }
}

// Verify JWT 
export const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) throw new Error('invalid jwt');
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
    // TODO check if payload data is valid
    req.jwtPayload = decoded;

    next();
  } catch (error) {
    console.error(`verifyAuthToken error. ${error}`);
    res.status(401).end();
  }
}