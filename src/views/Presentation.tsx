import React from "react";

const Presentation: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 px-4 py-8">
    <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8">
      <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">Nutricionista personal con IA</h1>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-green-600 mb-2">Idea</h2>
        <p className="text-gray-800">Nutricionista personal con IA</p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-green-600 mb-2">Explicación</h2>
        <p className="text-gray-800">
          Ayudar a las personas con un nutricionista personal para cada uno hecho con IA.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-green-600 mb-2">Relevancia</h2>
        <p className="text-gray-800">
          Social, ya que ayuda a que la sociedad pueda tener un orden alimenticio.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-green-600 mb-2">Medir</h2>
        <p className="text-gray-800">
          Todo aquel que desea hacer un cambio físico.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-green-600 mb-2">Producto</h2>
        <p className="text-gray-800">
          Aplicación móvil.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-green-600 mb-2">Población</h2>
        <p className="text-gray-800">
          Personas en el gimnasio.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-green-600 mb-2">Factibilidad</h2>
        <ul className="list-disc pl-6 text-gray-800">
          <li>
            <span className="font-bold">Técnica:</span> Si se puede, ya que no se necesita gran poder cómputo para crear la aplicación y se puede usar las APIs de las IAs existentes.
          </li>
          <li>
            <span className="font-bold">Económica:</span> Se puede hacer gratis, pero si deseas pagar la IA sería mejor, ya con esto se puede pensar en cobro mensual.
          </li>
          <li>
            <span className="font-bold">Temporal:</span> Si, se puede hacer rápido y la idea es hacerla grande.
          </li>
        </ul>
      </section>
    </div>
  </div>
);

export default Presentation;
