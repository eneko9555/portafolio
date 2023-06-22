import mongoose from "mongoose";
import Project from "../models/Project.js";

mongoose
  .connect("mongodb+srv://root:mt2guabina@cluster0.l2hifvg.mongodb.net/")
  .then(() => {
    console.log("conectada");
  });

const projects = [
  {
    name: "PManager",
    description: "Gestión y colaboración de proyectos en tiempo real",
    images: ["pmanager-foto1", "pmanager-foto2"],
    about:
      "PManager es una aplicación para la gestión y colaboración de proyectos en tiempo real. Con una interfaz intuitiva que facilita la organización de tareas, seguimiento del progreso y comunicación en equipos. Permite crear proyectos, asignar tareas, establecer fechas límite y la colaboración entre diferentes usuarios",
    technologies: [
      "React",
      "Node",
      "Javascript",
      "Tailwind",
      "Mongo",
      "Socket IO",
      "Context",
    ],
    account: ["test@correo.com", "123456"],
    website: "https://lively-llama-a85a0d.netlify.app",
    github: "https://github.com/eneko9555/frontend-pmanager",
    category: "fullstack",
  },
  {
    name: "Files Send",
    description: "Subida y descarga de archivos de manera privada y segura",
    images: ["files-send-foto1", "files-send-foto2"],
    about:
      "Files Send permite compartir archivos de manera segura entre usuarios, dando mayores beneficios a los usuarios con cuenta de acceso.",
    technologies: [
      "React",
      "Node",
      "Javascript",
      "Tailwind",
      "Mongo",
      "Context",
      "Multer",
    ],
    account: ["test@correo.com", "123456"],
    website: "https://files-send-frontend.vercel.app/",
    github: "https://github.com/eneko9555/Files-Send-Frontend",
    category: "fullstack",
  },
  {
    name: "Administrador de presupuesto",
    description: "Administra y controla tus gastos de una manera organizada",
    images: ["controlador-gastos-foto1", "controlador-gastos-foto2"],
    about:
      "Añade, filtra, edita y controla tus gastos desde una interfaz intuitiva y fácil de usar.",
    technologies: ["React", "Javascript", "Css", "Context", "LocalStorage"],
    account: [],
    website: "https://tourmaline-melomakarona-bccf40.netlify.app/",
    github: "https://github.com/eneko9555/control-gastos",
    category: "frontend",
  },
  {
    name: "Quiosco de comida",
    description:
      "Aplicación que permite añadir y gestionar pedidos en tiempo real.",
    images: ["quiosco1", "quiosco2"],
    about:
      "La aplicación está diseñada para agilizar el proceso de pedidos en un entorno de quiosco o punto de venta. Los clientes pueden explorar el menú, seleccionar los productos deseados y personalizar sus pedidos según sus preferencias. Por otro lado, el área de servicio de la aplicación permite al personal recibir, procesar y administrar los pedidos entrantes de manera organizada.",
    technologies: [
      "Next",
      "Javascript",
      "Tailwind",
      "Context",
      "Prisma",
      "MySQL",
      "SWR",
    ],
    account: [],
    website: "https://quioscoapp.onrender.com/",
    github: "https://github.com/eneko9555/quiosco-app",
    category: "fullstack",
  },
  {
    name: "Tienda de guitarras",
    description: "Página web relacionada con el mundo de la música.",
    images: ["guitarra1", "guitarra2"],
    about:
      "Se trata de una página web que ofrece una experiencia completa para los amantes de la música y las guitarras.  Los usuarios pueden navegar por el catálogo, ver detalles de cada guitarra, incluyendo imágenes y descripciones además pueden añadir guitarras al carrito de compra, administrando las cantidades y viendo los precios en tiempo real.",
    technologies: [
      "Next",
      "Javascript",
      "CSS",
      "Context",
      "Strapi",
      "PostgreSQL",
    ],
    account: [],
    website: "https://tienda-guitarras-next-hi3g.vercel.app/",
    github: "https://github.com/eneko9555/tienda-guitarras-frontend",
    category: "fullstack",
  },
  {
    name: "Administrador de Pacientes ",
    description:
      "Aplicación que permite la gestión y organización de pacientes",
    images: ["pacientes1", "pacientes2"],
    about:
      "Con esta aplicación cada usuario tendrá una cuenta en la que puedes mantener un registro centralizado de la información de tus pacientes, facilitando su seguimiento y asegurando una gestión eficiente. Los usuarios podrán recuperar su contraseña en caso de perdida mediante correo electronico.",
    technologies: [
      "React",
      "Javascript",
      "Tailwind",
      "Context",
      "MongoDB",
      "Node",
      "Express",
    ],
    account: ["test@correo.com", "12345678"],
    website: "https://resonant-zuccutto-53ab4a.netlify.app/",
    github: "https://github.com/eneko9555/mern-ap-frontend",
    category: "fullstack",
  },
  {
    name: "Cotizador",
    description:
      "Aplicación que permite la cotización de pagos en diferentes plazos.",
    images: ["cotizador1", "cotizador2"],
    about:
      "Permite hacer una cotización en tiempo real, dependiendo de la cantidad seleccionada y el tiempo de plazo a pagar.",
    technologies: ["React", "Javascript", "Vite", "Tailwind"],
    account: [],
    website: "https://moonlit-gingersnap-7d01c0.netlify.app/",
    github: "https://github.com/eneko9555/cotizador",
    category: "frontend",
  },
  {
    name: "App Clima",
    description:
      "Página web que permite ver el clima actual en diferentes lugares.",
    images: ["clima1", "clima2"],
    about:
      "Permite ver el tiempo en diferentes ciudades con una interfaz intuitiva y sencilla de usar.",
    technologies: ["React", "Javascript", "Vite", "CSS"],
    account: [],
    website: "https://bespoke-tanuki-9003a8.netlify.app/",
    github: "https://github.com/eneko9555/clima-app",
    category: "frontend",
  },
  {
    name: "Criptomonedas",
    description:
      "Aplicación que permite ver el valor actual de las criptomonedas.",
    images: ["cripto1", "cripto2"],
    about:
      "Con una interfaz sencilla e intuitiva permite ver el valor actual de la criptomoneda seleccionada, así como los cambios en las últimas 24h",
    technologies: ["React", "Javascript", "Vite", "Style Components"],
    account: [],
    website: "https://remarkable-sable-3efc6a.netlify.app/",
    github: "https://github.com/eneko9555/crypto-React",
    category: "frontend",
  },
  {
    name: "Gasto Semanal",
    description:
      "Aplicación que permite controlar y gestionar un presupuesto añadiendo gastos.",
    images: ["gasto1", "gasto2"],
    about:
      "Con una interfaz sencilla e intuitiva permite añadir un presupuesto e ir añadiendo los gastos semanales, permitiendo así una gestión completa de nuestros gastos.",
    technologies: ["Javascript", "CSS"],
    account: [],
    website: "https://monumental-sprite-85144b.netlify.app/",
    github: "https://github.com/eneko9555/gasto-semanal-js",
    category: "frontend",
  },
  {
    name: "Buscador de recetas",
    description:
      "Página web en la que podemos buscar recetas de comida y bebida.",
    images: ["receta1", "receta2"],
    about:
      "Permite buscar y añadir a favoritos recetas que nos gusten para su posterior busqueda. Con un modal detallado para cada una de las recetas, con sus ingredientes e intrucciones.",
    technologies: ["Javascript", "CSS"],
    account: [],
    website: "https://soft-faun-e4b21d.netlify.app/index.html",
    github: "https://github.com/eneko9555/buscador-recetas-js",
    category: "frontend",
  },
  {
    name: "Buscador imágenes",
    description: "Página web que permite la busqueda de imagenes",
    images: ["pixabay1", "pixabay2"],
    about: "Permite buscar imagenes y descargarlas usando la API de pixabay.",
    technologies: ["Javascript", "CSS"],
    account: [],
    website: "https://bright-sherbet-972694.netlify.app/",
    github: "https://github.com/eneko9555/buscador-pixabay",
    category: "frontend",
  },
  {
    name: "Mis Peliculas",
    description:
      "Página web personal que permite guardar las peliculas favoritas",
    images: ["peli1", "peli2"],
    about:
      "Permite guardar en localstorage titulos de peliculas y una pequeña descripción, también permite la búsqueda por titulo.",
    technologies: ["Javascript", "CSS", "POO", "Localstorage"],
    account: [],
    website: "https://preeminent-palmier-12979d.netlify.app/",
    github: "https://github.com/eneko9555/peliculas-localstorage-js",
    category: "frontend",
  },
];

const seedDB = async () => {
  await Project.deleteMany({});
  await Project.insertMany(projects);
};

seedDB().then(() => {
  mongoose.connection.close();
});
