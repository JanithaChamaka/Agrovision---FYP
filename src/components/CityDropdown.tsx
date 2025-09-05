import { useState } from "react";
import { VALID_TOWNS } from "../constants/townsList";

interface CityDropdownProps {
  city: string;
  setCity: (city: string) => void;
}

export default function CityDropdown({ city, setCity }: CityDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      {/* Dropdown button */}
      <div
        className={`flex border border-black text-xl ${
          city ? "text-black" : "text-black"
        } items-center h-15 rounded-lg px-3 py-3 cursor-pointer bg-white relative`}
        onClick={() => setOpen(!open)}
      >
        {city || "Select a city"}
        <div className="flex-1" />
        <span className="">{open ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute mt-1 w-full border rounded bg-white shadow-lg max-h-40 overflow-y-auto z-10">
          {VALID_TOWNS.map((town) => (
            <div
              key={town}
              className={`px-3 py-2 text-[15px] hover:bg-green-100 cursor-pointer ${
                city === town ? "bg-green-200" : ""
              }`}
              onClick={() => {
                setCity(town);
                setOpen(false);
              }}
            >
              {town}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
