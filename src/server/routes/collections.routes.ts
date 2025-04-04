import {Router} from "express"
import collectionsController from "../controllers/collections.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = Router()

router
    .post("/", verifyJWT, collectionsController.create)
    .put("/", verifyJWT, collectionsController.update)


export {router as collectionsRouter}
