import mongoose from "mongoose"
import Skills from "../models/Skills.js"

const getSkills = async ( req, res ) => {
    const {category} = req.body
    try {
        const skills = await Skills.find().where({ category })
        res.status(200).json(skills)
    } catch (error) {
        console.log(error);
    }
  
}

export {getSkills}