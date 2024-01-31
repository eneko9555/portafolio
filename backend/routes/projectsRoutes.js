import express from "express"
import { getProjects, getProject, getAllProjects, getMainProjects } from "../controllers/projectsController.js"

const router = express.Router()

router.get("/", getProjects)
router.get("/all", getAllProjects)
router.get("/main", getMainProjects)
router.get("/:id", getProject)



export default router