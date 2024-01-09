require('./common/env');
import express, { Request, Response , Application } from 'express';
import jwt from 'jsonwebtoken';
import userRoutes from './handlers/user';

const app: Application = express();
const port = process.env.PORT;

// Use middleware to handle data from the POST method
app.use(express.json());

// home page
app.get('/', (req: Request, res: Response) => {
  res.send('Tech Assignment - Backend Data Handling.');
});

// get a valid JWT to make request to user's API
// In practice, JWTs are often generated after a user logs in, but in this code section, 
// I will simplify it by directly creating the JWT without the need for authentication.
app.get('/getJWT', async (req: Request, res: Response) => {
  try {
    const payload = { name: 'Chuong Le', email: 'chuong.le.jp@gmail.com' };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string);
    res.send(token);
  } catch (error) {
    console.log(error);
  }
});

// API relate to user
userRoutes(app);

// Start the server
app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

export default app;
