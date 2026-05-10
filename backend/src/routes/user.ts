import { Router } from 'express';
import {
	createUserController,
	deleteUserController,
	getProfileController,
	getSearchUsersController,
	getUserByIdController,
	getUsersController,
	updateUserController,
} from '../app/controllers/user';
import { authenticate } from '../middlewares/auth';
import { CreateUserValidator, UpdateUserValidator, UserIdParamValidator } from '../app/validations/user';

const userRouter = Router();

userRouter.use(authenticate);

userRouter.get('/profile', getProfileController);

userRouter.route('/')
	.get(getUsersController)
	.post(CreateUserValidator, createUserController);

userRouter.get('/search', getSearchUsersController);

userRouter
	.route('/:id')
	.get(UserIdParamValidator, getUserByIdController)
	.put(UserIdParamValidator, UpdateUserValidator, updateUserController)
	.delete(UserIdParamValidator, deleteUserController);

export default userRouter;