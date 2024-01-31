import mongoose from "mongoose";
import Project from "../models/Project.js";

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).limit(4);
    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
  }
};

const getMainProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isMain: true });
    console.log(projects);
    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
  }
};

const getProject = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID de proyecto inválido" });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res
        .status(404)
        .json({ msg: "Proyecto no encontrado o no existe" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.log(error);
  }
};

export { getProjects, getProject, getAllProjects, getMainProjects };
