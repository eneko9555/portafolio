import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { useEffect, useRef } from "react";

function Modal({ isOpen, setIsOpen, project }) {
  const modalRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        modalRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 10);
    }
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 "
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto " ref={modalRef}>
          <div className="flex  items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="panel w-full max-w-2xl  transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h5"
                  className="text-md flex justify-between items-center font-medium leading-6 text-gray-900 p-2 border-b border-gray-200"
                >
                  <p onClick={() => setIsOpen(false)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 hover:scale-105 duration-300 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                      />
                    </svg>
                  </p>
                  <p
                    className="hover:text-gray-400 cursor-pointer duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Volver a proyectos
                  </p>
                </Dialog.Title>

                <div>
                  <p className="text-2xl font-bold leading-6 text-black  mt-8 border-gray-200">
                    {project.name}
                  </p>
                  <p className="text-md  leading-6 mt-5 text-black  border-gray-200">
                    {project.description}
                  </p>
                  <img
                    src={`/images/${project.images[1]}.png`}
                    className=" mt-5 rounded-lg shadow-md shadow-gray-400 "
                    alt={`Imagen del proyecto ${project.name}`}
                  />

                  <p className="font-semibold mt-5 text-xl">Descripción</p>
                  <p className="mt-2">{project.about}</p>
                  <div className="flex items-center mt-5 gap-2">
                    <p className="font-semibold text-xl order-2">Tecnologías</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.4}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                      />
                    </svg>
                  </div>

                  <div className="mt-2 flex items-center text-center  flex-row overflow-x-scroll md:overflow-auto">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="m-1  bg-gradient-to-bl from-cyan-950 to-zinc-600 text-white p-2 rounded-lg px-3 border-gray-400 border-b-4"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-2 mb-2">
                    <img
                      className="w-6"
                      src="/images/github-mark.png"
                      alt="Imagen logotipo Github"
                    />
                    <p className="font-semibold  text-xl">Github</p>
                  </div>
                  <Link
                    target="_blank"
                    href={project.github}
                    className=" font-semibold  hover:underline"
                  >
                    {project.github}
                  </Link>
                  {project?.account.length && (
                    <div className="mt-5">
                      <div className="flex -ml-1 items-center gap-2 ">
                        <p className="font-semibold text-xl order-2">
                          Usuario de prueba
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.6}
                          stroke="currentColor"
                          className="w-8 h-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>

                      <p className="mt-2">
                        <span>Usuario: </span>
                        {project.account[0]}
                      </p>
                      <p className="mt-2">Contraseña: {project.account[1]}</p>
                    </div>
                  )}
                  <Link
                    target="_blank"
                    className=" flex items-center gap-3 justify-center mt-5 text-white font-semibold p-2 py-3 rounded-lg w-full bg-gradient-to-bl from-cyan-950 to-zinc-600 hover:text-gray-400 duration-300"
                    href={project.website}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                      />
                    </svg>
                    Visitar proyecto
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
