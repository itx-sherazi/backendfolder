import express from "express";
const adminroutes = express.Router();
import { requiredLoggedIn, checkAdmin} from '../middlewares/authMiddleware.js';

import * as admin from "../controllers/admin.js";


adminroutes.get('/users',admin.fetchUsers);

export default adminroutes;