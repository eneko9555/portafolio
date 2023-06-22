import express from "express"
import { getProjects, getProject, getAllProjects } from "../controllers/projectsController.js"

const router = express.Router()

router.get("/" , getProjects)
router.get("/all" , getAllProjects)
router.get("/:id", getProject)


export default router