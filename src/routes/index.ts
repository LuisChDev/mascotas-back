import { Router } from 'express';
import { adminMW } from './middleware';
import authR from './Auth';
import usrR from './Users';
import { Repository } from 'typeorm';
import { User } from '@entities/User';
// { getAllUsers, addOneUser, updateOneUser, deleteOneUser }


export default (usrRep: Repository<User>) => {
  const { getAllUsers, addOneUser, updateOneUser, deleteOneUser } = usrR(usrRep);
  const { login, logout } = authR(usrRep);

  // Auth router
  const authRouter = Router();
  authRouter.post('/login', login);
  authRouter.get('/logout', logout);

  // User-router
  const userRouter = Router();
  userRouter.get('/all', getAllUsers);
  userRouter.post('/add', addOneUser);
  userRouter.put('/update', updateOneUser);
  userRouter.delete('/delete/:id', deleteOneUser);

  // Export the base-router
  const baseRouter = Router();
  baseRouter.use('/auth', authRouter);
  baseRouter.use('/users', adminMW, userRouter);

  return baseRouter;
};
