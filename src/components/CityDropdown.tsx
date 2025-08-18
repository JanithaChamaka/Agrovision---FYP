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
        className="border rounded px-3 py-2 cursor-pointer bg-white relative"
        onClick={() => setOpen(!open)}
      >
        {city || "Select a city"}
        <div>
            <span className="absolute right-3 top-2">
              {open ? "▲" : "▼"}
            </span>
        </div>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute mt-1 w-full border rounded bg-white shadow-lg max-h-40 overflow-y-auto z-10">
          {VALID_TOWNS.map((town) => (
            <div
              key={town}
              className={`px-3 py-2 hover:bg-green-100 cursor-pointer ${
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