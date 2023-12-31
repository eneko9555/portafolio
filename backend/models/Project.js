import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    images: [{ type: String }],
    about: {
      type: String,
    },
    technologies: [{ type: String }],
    website: {
      type: String,
    },
    github: {
      type: String,
    },
    account: [{ type: String, default: null }],
    category: {
      type: String,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
