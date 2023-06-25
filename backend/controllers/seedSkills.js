import mongoose from "mongoose";
import Skills from "../models/Skills.js";

mongoose
  .connect("mongodb+srv://root:mt2guabina@cluster0.l2hifvg.mongodb.net/")
  .then(() => {
    console.log("conectada");
  });

const skills = [
  {
    name: "HTML",
    image: "html.png",
    category: "frontend",
  },
  {
    name: "CSS",
    image: "css.png",
    category: "frontend",
  },
  {
    name: "Tailwind",
    image: "tailwind.png",
    category: "frontend",
  },
  {
    name: "Bootstrap",
    image: "bootstrap.png",
    category: "frontend",
  },
  {
    name: "Javascript",
    image: "javascript.png",
    category: "frontend",
  },
  {
    name: "React",
    image: "react.png",
    category: "frontend",
  },
  {
    name: "Next",
    image: "next.png",
    category: "frontend",
  },
  {
    name: "Redux",
    image: "redux.png",
    category: "frontend",
  },
  {
    name: "Node",
    image: "node.png",
    category: "backend",
  },
  {
    name: "MongoDB",
    image: "mongodb.png",
    category: "backend",
  },
  {
    name: "PostgreSQL",
    image: "postgresql.png",
    category: "backend",
  },
  {
    name: "MySQL",
    image: "mysql.png",
    category: "backend",
  },
  {
    name: "Prisma",
    image: "prisma.png",
    category: "backend",
  },
  {
    name: "Firebase",
    image: "firebase.png",
    category: "backend",
  },

  {
    name: "Rest API",
    image: "rest.png",
    category: "backend",
  },
  {
    name: "VSCode",
    image: "vscode.png",
    category: "tools",
  },
  {
    name: "Terminal",
    image: "terminal.png",
    category: "tools",
  },
  {
    name: "Git",
    image: "git.png",
    category: "tools",
  },
  {
    name: "Github",
    image: "github.png",
    category: "tools",
  },
  {
    name: "Postman",
    image: "postman.png",
    category: "tools",
  },
  {
    name: "pgAdmin",
    image: "pgadmin.png",
    category: "tools",
  },
  {
    name: "MySQL Workbench",
    image: "mysqlwork.png",
    category: "tools",
  },
  {
    name: "Compass",
    image: "compass.png",
    category: "tools",
  },
];

const seedDB = async () => {
  await Skills.deleteMany({});
  await Skills.insertMany(skills);
};

seedDB().then(() => {
  mongoose.connection.close();
});
