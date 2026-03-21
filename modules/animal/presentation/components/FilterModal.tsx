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

export function FilterModal({
  visible,
  onClose,
  filters,
  setFilters,
}: FilterModalProps) {
  if (!visible) return null;

  const toggleFilter = (key: ArrayFilterKey, value: string) => {
    const arr = filters[key] || [];
    const lowerValue = value.toLowerCase();

    if (arr.map((v) => v.toLowerCase()).includes(lowerValue)) {
      setFilters({
        ...filters,
        [key]: arr.filter((v) => v.toLowerCase() !== lowerValue),
      });
    } else {
      setFilters({
        ...filters,
        [key]: [...arr, value],
      });
    }
  };

  const renderButtons = (key: ArrayFilterKey, options: string[]) => (
    <div className="flex flex-wrap gap-3 mb-2">
      {options.map((v) => {
        const active = (filters[key] as string[])
          ?.map((f) => f.toLowerCase())
          .includes(v.toLowerCase());

        return (
          <button
            key={v}
            onClick={() => toggleFilter(key, v)}
            className={`px-4 py-2 rounded-xl border transition text-sm ${
              active
                ? "bg-[#D4B37A] border-[#D4B37A] text-white font-bold"
                : "bg-white border-[#DAC193] text-[#311c1c] hover:bg-[#F7F1E7]"
            }`}
          >
            {v}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-2xl rounded-[20px] border border-[#E8E0D0] bg-[#FDF8F0] p-6 md:p-8 shadow-xl">
        <h2 className="text-center text-2xl font-bold text-[#311c1c] mb-6">
          Filtros
        </h2>

        <div className="space-y-5">
          <div>
            <h3 className="text-[15px] font-semibold text-[#311c1c] mb-2">
              Tipo
            </h3>
            {renderButtons("type", ["Perro", "Gato"])}
          </div>

          <div>
            <h3 className="text-[15px] font-semibold text-[#311c1c] mb-2">
              Sexo
            </h3>
            {renderButtons("sex", ["Hembra", "Macho"])}
          </div>

          <div>
            <h3 className="text-[15px] font-semibold text-[#311c1c] mb-2">
              Tamaño
            </h3>
            {renderButtons("size", ["Pequeño", "Mediano", "Grande"])}
          </div>

          <div>
            <h3 className="text-[15px] font-semibold text-[#311c1c] mb-2">
              Animales adoptados
            </h3>
            <button
              onClick={() =>
                setFilters({ ...filters, adopted: !filters.adopted })
              }
              className={`px-4 py-2 rounded-xl border transition text-sm ${
                filters.adopted
                  ? "bg-[#D4B37A] border-[#D4B37A] text-white font-bold"
                  : "bg-white border-[#DAC193] text-[#311c1c] hover:bg-[#F7F1E7]"
              }`}
            >
              Mostrar animales adoptados
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-3">
          <button
            onClick={() =>
              setFilters({
                type: [],
                sex: [],
                size: [],
                adopted: false,
              })
            }
            className="w-full md:w-1/2 rounded-xl bg-[#E8B4B4] py-3 text-white font-bold transition hover:opacity-90"
          >
            Limpiar filtros
          </button>

          <button
            className="w-full md:w-1/2 rounded-xl bg-[#B7C979] py-3 text-white font-bold text-[15px] transition hover:opacity-90"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}