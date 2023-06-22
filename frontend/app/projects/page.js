"use client";
import useProjects from "../hooks/useProjects";
import Link from "next/link";
import Project from "../components/Project";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const page = () => {
  const [limit, setLimit, getProjects] = useProjects();
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [filter, setFilter] = useState([]);
  const [all, setAll] = useState(false);

  async function showAllProjects() {
    try {
      const { data } = await axios("http://localhost:4000/api/projects/all");
      setLimit(data);
      setAll(true);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      scrollPosition > 200 ? setVisible(true) : setVisible(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (category) {
      const filter = limit?.filter((p) => p.category === category);
      setFilter(filter);
    }
  }, [category]);

  return (
    <>
      <div className="text-gray-100 text-8xl scale-125 translate-y-80 mt-20 tracking-widest opacity-5  font-semibold font-mono absolute rotate-90 right-0  translate-x-44  cursor-default -z-50 ">
        Proyectos
      </div>

      <main className="p-4 w-full sm:p-0 sm:w-3/4 md:w-8/12 lg:w-4/6 m-auto sm:mt-12 lg:mt-32 ">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="sm:flex items-center justify-between text-white">
            <h1 className="font-bold text-white tracking-wide text-5xl">
              Proyectos.
            </h1>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 cursor-pointer hover:text-gray-400 duration-300 text-center mt-5"
              onClick={() =>
                limit.length <= 4
                  ? showAllProjects()
                  : getProjects() && setCategory("")
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
          </div>
        </motion.div>
        <AnimatePresence>
          {all && limit.length > 4 && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <div className="mt-8 justify-center m-auto flex gap-2 -mb-5">
                <button
                  type="button"
                  className={`text-white  text-lg  p-2 w-20  duration-150 border border-white ${
                    category === ""
                      ? " font-black text-white border-4"
                      : "font-normal"
                  }`}
                  onClick={() => setCategory("")}
                >
                  Todos
                </button>
                <button
                  type="button"
                  className={`text-white  text-lg p-2  duration-150 border border-white ${
                    category === "fullstack"
                      ? "  font-black text-white border-4"
                      : " font-normal "
                  }`}
                  onClick={() => setCategory("fullstack")}
                >
                  Full-Stack
                </button>
                <button
                  type="button"
                  className={`text-white  text-lg p-2  duration-150 border border-white ${
                    category === "frontend"
                      ? " font-black text-white border-4"
                      : " font-normal"
                  }`}
                  onClick={() => setCategory("frontend")}
                >
                  Front-End
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className=" grid grid-flow-row grid-cols-1 xl:grid-cols-2 gap-12 mt-10 m-auto justify-center">
          {!category
            ? limit?.map((project) => (
                <Project
                  project={project}
                  setVisible={setVisible}
                  key={project._id}
                />
              ))
            : filter.length > 0 &&
              filter?.map((project) => (
                <Project
                  project={project}
                  setVisible={setVisible}
                  key={project._id}
                />
              ))}
        </div>

        {limit?.length <= 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className=" m-auto text-center flex items-center gap-3 mt-20 justify-center text-white hover:text-gray-400 duration-300">
              <button
                className=" font-bold text-xl  "
                onClick={() => showAllProjects()}
              >
                Ver más proyectos
              </button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 animate-bounce "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                />
              </svg>
            </div>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <div className="flex items-center gap-3 mt-20  text-gray-100  ">
            <Link
              href={"/contact"}
              className="text-gray-100 text-md font-semibold hover:text-gray-400 duration-300"
            >
              Contacto
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

          <div className="sm:flex justify-between items-center mt-10 sm:mt-8 mb-5   border-t-2 pt-5  gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-lg shadow-sm border-b-4 border-gray-400 hover:border-none duration-100">
                <Link target="_blank" href={"https://github.com/eneko9555"}>
                  {" "}
                  <img
                    src="/images/github-white.png"
                    className="w-6"
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

            <div className="block items-center mt-5 sm:mt-0 ">
              <p className="font-semibold text-sm text-white">
                Desarrollado con Next, Node y Tailwind
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      <div className=" text-white font-bold z-50 float-right   -mt-52 mr-12  sticky bottom-5">
        <button
          className={`${
            visible
              ? " flex items-center gap-2 bg-gray-50 p-2 rounded-lg shadow border-b-4 px-6 border-black animate-bounce"
              : "hidden"
          }`}
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="black"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default page;
