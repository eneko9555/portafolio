"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import Link from "next/link";
import ContactModal from "../components/ContactModal";

const page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState("");
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contact`, {
        name,
        email,
        message,
      });
      setSuccess(true);
      setEmail("");
      setName("");
      setMessage("");
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <div className="text-gray-100 hidden md:block text-8xl scale-125 translate-y-80 mt-10 tracking-widest opacity-5  font-semibold font-mono absolute rotate-90 right-0  translate-x-36  cursor-default ">
        Contacto
      </div>

      <main className="p-4  w-full sm:p-0 sm:w-3/4 md:w-8/12 lg:w-4/6 m-auto sm:mt-12 lg:mt-32 ">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="font-bold text-left text-white tracking-wide text-5xl">
            Contacto.
          </h1>
        </motion.div>

        <section className="mt-8 w-full m-auto block ">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <p className="text-white text-lg mb-2">
              Si estás interesado en contactar conmigo, enviame un email a
              traves de este formulario o enviame un email directamente a{" "}
              <Link
                target="_blank"
                href={"mailto:eneko.fdez.garcia@gmail.com"}
                className="font-semibold hover:text-gray-400 duration-300"
              >
                {" "}
                eneko.fdez.garcia@gmail.com
              </Link>
            </p>

            <form onSubmit={handleSubmit}>
              <div>
                <input
                  required
                  placeholder="Nombre"
                  className=" text-white w-full md:w-4/5  lg:w-3/5 mt-6 rounded-lg p-2 py-4 bg-transparent border border-white focus:text-black focus:bg-gray-200 outline-none focus:opacity-100 mb-5 "
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>

              <div>
                <input
                  required
                  placeholder="Email"
                  type="email"
                  className="w-full md:w-4/5  lg:w-3/5 focus:text-black text-white mt-5 rounded-lg p-2 py-4 bg-transparent border border-white  focus:bg-gray-200 outline-none focus:opacity-100 mb-5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
              </div>

              <div>
                <textarea
                  required
                  placeholder="Mensaje"
                  className="w-full md:w-4/5 lg:w-3/5 min-h-[8rem] focus:text-black text-white  mt-5 rounded-lg p-2 py-4 bg-transparent border border-white  focus:bg-gray-200 outline-none focus:opacity-100"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <ContactModal isOpen={isOpen} setIsOpen={setIsOpen} />
              <button
                type="submit"
                className="btn w-full md:w-4/5 lg:w-3/5 font-bold uppercase bg-gray-200 rounded-lg p-3 py-4 mt-8 hover:bg-gray-400 duration-300 cursor-pointer"
              >
                {loading ? (
                  <Loading />
                ) : success ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#083344 "
                    className="w-8 h-8 text-center m-auto "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  "Enviar"
                )}
              </button>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <div className="flex items-center gap-3 mt-16 -mb-5 text-gray-100 ">
              <Link
                href={"/"}
                className="text-gray-100 text-lg font-semibold hover:text-gray-400 duration-300"
              >
                Volver a Inicio
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

            <div className="sm:flex justify-between  items-center mt-14 mb-5 lg:mb-16    gap-2 border-t-2">
              <div className="flex gap-3 pt-5">
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

              <div className="block items-center mt-5">
                <p className="font-semibold text-sm text-white text-left">
                  Desarrollado con Next, Node y Tailwind
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </>
  );
};

export default page;
