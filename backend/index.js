import express from "express";
import dotenv from "dotenv";
import DB from "./config/DB.js";
import projectsRoutes from "./routes/projectsRoutes.js";
import cors from "cors";
import nodemailer from "nodemailer";
import skillsRoutes from "./routes/skillsRoutes.js";

const app = express();
app.use(express.json());
dotenv.config();
DB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use("/api/projects", projectsRoutes);
app.use("/api/skills", skillsRoutes);

app.use("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Mensaje portfolio" <portfolio@correo.com>',
    to: "eneko.fdez.garcia@gmail.com",
    subject: "Mensaje de portfolio ",
    text: `Mensaje de ${name} con correo ${email}`,
    html: `
        <div>
            <p>Mensaje de <b>${name}</b> con correo <b>${email}</b></p>  
            <p>${message}</p>
        </div>
        `,
  });
  res.status(200).json({
    msg: "Mensaje enviado, me pondre en contacto contigo lo antes posible!",
  });
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
