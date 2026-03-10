"use client";

import { Dispatch, SetStateAction } from "react";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}

export interface Filters {
  type: string[];
  sex: string[];
  size: string[];
  adopted: boolean;
}

type ArrayFilterKey = "type" | "sex" | "size";

export function FilterModal({ visible, onClose, filters, setFilters }: FilterModalProps) {
  if (!visible) return null;

  const toggleFilter = (key: ArrayFilterKey, value: string) => {
    const arr = filters[key] || [];
    const lowerValue = value.toLowerCase();

    if (arr.map(v => v.toLowerCase()).includes(lowerValue)) {
      setFilters({
        ...filters,
        [key]: arr.filter(v => v.toLowerCase() !== lowerValue),
      });
    } else {
      setFilters({
        ...filters,
        [key]: [...arr, value],
      });
    }
  };

  const renderButtons = (key: ArrayFilterKey, options: string[]) => (
    <div className="flex flex-wrap gap-2 mb-2">
      {options.map(v => {
        const active = (filters[key] as string[])?.map(f => f.toLowerCase()).includes(v.toLowerCase());
        return (
          <button
            key={v}
            className={`px-3 py-2 rounded-lg ${active ? "bg-yellow-700 text-white font-bold" : "bg-gray-300"}`}
            onClick={() => toggleFilter(key, v)}
          >
            {v}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4">Filtros</h2>

        <div>
          <p>Tipo</p>
          {renderButtons("type", ["Perro", "Gato"])}

          <p>Sexo</p>
          {renderButtons("sex", ["Hembra", "Macho"])}

          <p>Tamaño</p>
          {renderButtons("size", ["Pequeño", "Mediano", "Grande"])}

          <p>Animales adoptados</p>
          <button
            className={`px-3 py-2 rounded-lg ${filters.adopted ? "bg-yellow-700 text-white font-bold" : "bg-gray-300"}`}
            onClick={() => setFilters({ ...filters, adopted: !filters.adopted })}
          >
            Mostrar animales adoptados
          </button>
        </div>

        <button
          className="mt-6 px-4 py-3 bg-green-600 text-white font-bold rounded-lg w-full text-center"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}