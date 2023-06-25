"use client";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";

const page = () => {
  const [frontend, setFrontend] = useState([]);
  const [backend, setBackend] = useState([]);
  const [tools, setTools] = useState([]);

  async function getSkills() {
    const [frontend, backend, tools] = await Promise.all([
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/skills`, {
        category: "frontend",
      }),
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/skills`, {
        category: "backend",
      }),
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/skills`, {
        category: "tools",
      }),
    ]);
    setFrontend(frontend.data);
    setBackend(backend.data);
    setTools(tools.data);
  }

  useEffect(() => {
    getSkills();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <div className="text-gray-100 text-8xl hidden md:block scale-125  translate-y-96 tracking-widest opacity-5  font-bold font-mono absolute rotate-90 right-0 translate-x-48 mr-12 cursor-default">
        Sobre mí
      </div>
      <main className="p-4 w-full sm:p-0 sm:w-3/4 md:w-8/12 lg:w-4/6 m-auto sm:mt-12 lg:mt-32  ">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="font-bold text-white tracking-wide text-5xl">
            Sobre mí.
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p className="mt-8 text-white text-lg">
            Soy desarrollador web full stack con conocimientos en sistemas y
            redes. Me considero una persona autodidacta que siempre intenta
            buscar nuevas formas para aprender y crecer en el campo de la
            programación. Recientemente, he dado un paso más, y estoy realizando
            el bootcamp de desarrollo web full stack de Isdi Coders, con el que
            espero enriquecer mi formación.{" "}
          </p>
          <p className="text-white text-lg">
            Estoy abierto a nuevas oportunidades laborales donde pueda
            contribuir, aprender y crecer como profesional. Si tienes algún
            proyecto que coincida con mis habilidades, no dudes en contactarme.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <h2 className=" mt-16 font-bold text-white tracking-wide text-3  text-3xl">
            Tecnologías
          </h2>
          <p className="text-white text-lg mt-5">
            Estas son las tecnologías y herramientas que utilizo para el
            desarrollo de mis proyectos.
          </p>
          <div className="  mt-8 w-full rounded-lg pb-8 ">
            <div>
              <h2 className="text-center text-white p-2 font-semibold text-xl">
                Front - End
              </h2>
              <ul className="grid grid-cols-3  sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 mt-4 gap-2 sm:gap-5 items-center">
                {frontend.map((skill) => (
                  <div
                    className="bg-white  flex flex-col justify-between w-full h-[6rem] gap-1  items-center p-2 border rounded-lg shadow-lg border-b-4 border-l-4 border-gray-400 "
                    key={skill._id}
                  >
                    <img
                      src={`/iconImages/${skill.image}`}
                      className="text-center m-auto  "
                      width={50}
                      height={50}
                      alt="Logo"
                    />
                    <li className="text-xs font-semibold text-center">
                      {skill.name}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          </div>

          <div className=" mt-3 w-full rounded-lg pb-8 ">
            <div>
              <h2 className="text-center text-white p-2 font-semibold text-xl">
                Back - End
              </h2>
              <ul className="grid grid-cols-3  sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8   mt-4 gap-2 sm:gap-5 items-center">
                {backend.map((skill) => (
                  <div
                    className="bg-white  flex flex-col justify-between w-full h-[6rem] gap-1  items-center p-2 border rounded-lg shadow-lg border-b-4 border-l-4 border-gray-400 "
                    key={skill._id}
                  >
                    <img
                      src={`/iconImages/${skill.image}`}
                      className="text-center m-auto bg-transparent "
                      width={50}
                      height={50}
                      alt="Logo"
                    />
                    <li className="text-xs font-semibold text-center">
                      {skill.name}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          </div>

          <div className=" mt-3 w-full rounded-lg pb-8 ">
            <div>
              <h2 className="text-center text-white p-2 font-semibold text-xl">
                Herramientas
              </h2>
              <ul className="grid grid-cols-3  sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8   mt-4 gap-2 sm:gap-5 items-center">
                {tools.map((skill) => (
                  <div
                    className="bg-white  flex flex-col justify-between w-full h-[6rem] gap-1  items-center p-2 border rounded-lg shadow-lg border-b-4 border-l-4 border-gray-400 "
                    key={skill._id}
                  >
                    <img
                      src={`/iconImages/${skill.image}`}
                      className="text-center m-auto"
                      width={50}
                      height={50}
                      alt="Logo"
                    />
                    <li className="text-xs font-semibold text-center">
                      {skill.name}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-10 -mb-8 text-gray-100 ">
            <Link
              href={"/projects"}
              className="text-gray-100 text-lg font-semibold hover:text-gray-400 duration-300"
            >
              Ver proyectos
            </Link>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 animate-bounce animate-infinite animate-duration-1000 animate-ease-linear"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </div>
          <div className="sm:flex items-center mt-16 mb-5 lg:mb-16  justify-between pt-5 border-t-2">
            <div className="flex gap-3">
              <div className="bg-white p-1 rounded-lg shadow-sm border-b-4 border-gray-400 hover:border-none duration-100">
                <Link target="_blank" href={"https://github.com/eneko9555"}>
                  {" "}
                  <img
                    src="/images/github-white.png"
                    className="w-6  "
                    alt="logo"
                  />
                </Link>
              </div>
              <div className="bg-white p-1 rounded-lg shadow-sm border-b-4 border-gray-400 hover:border-none duration-100 ">
                <Link
                  target="_blank"
                  href={"/"}
                  className="pointer-events-none"
                >
                  {" "}
                  <img
                    src="/images/linkedin.png"
                    className="w-6 rounded-md "
                    alt="logo"
                  />
                </Link>
              </div>
              <div className="bg-white p-1 rounded-lg shadow-sm border-b-4 border-gray-400 hover:border-none duration-100 ">
                <Link
                  target="_blank"
                  href={"mailto:eneko.fdez.garcia@gmail.com"}
                  className=""
                >
                  {" "}
                  <img
                    src="/images/gmail.png"
                    className="w-6 rounded-md "
                    alt="logo"
                  />
                </Link>
              </div>
            </div>

            <div className="block items-center mt-5 sm:mt-0">
              <p className="font-semibold text-sm text-white">
                Desarrollado con Next, Node y Tailwind
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default page;
