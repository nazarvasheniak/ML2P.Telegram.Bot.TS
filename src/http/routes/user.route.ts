import * as express from 'express';
import UserService from '../../services/user.service';

export class UserRoute {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public getRoutes() {
        const router = express.Router();

        router.get('/', async(req, res) => {
            const users = await this.userService.getAllUsers();
            res.send(users);
        });
        
        return router;
    }
}