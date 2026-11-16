/**
 * División político-administrativa de Panamá (provincias, comarcas y distritos).
 * Es data estática editable: añadir un distrito aquí lo hace aparecer en el
 * formulario del panel y en los filtros del sitio público.
 */
export type Province = {
  name: string;
  districts: string[];
};

export const PANAMA_PROVINCES: Province[] = [
  {
    name: "Bocas del Toro",
    districts: ["Bocas del Toro", "Changuinola", "Chiriquí Grande", "Almirante"],
  },
  {
    name: "Chiriquí",
    districts: [
      "Alanje",
      "Barú",
      "Boquerón",
      "Boquete",
      "Bugaba",
      "David",
      "Dolega",
      "Gualaca",
      "Remedios",
      "Renacimiento",
      "San Félix",
      "San Lorenzo",
      "Tierras Altas",
      "Tolé",
    ],
  },
  {
    name: "Coclé",
    districts: ["Aguadulce", "Antón", "La Pintada", "Natá", "Olá", "Penonomé"],
  },
  {
    name: "Colón",
    districts: ["Colón", "Chagres", "Donoso", "Portobelo", "Santa Isabel", "Omar Torrijos Herrera"],
  },
  {
    name: "Darién",
    districts: ["Chepigana", "Pinogana", "Santa Fe"],
  },
  {
    name: "Herrera",
    districts: ["Chitré", "Las Minas", "Los Pozos", "Ocú", "Parita", "Pesé", "Santa María"],
  },
  {
    name: "Los Santos",
    districts: ["Guararé", "Las Tablas", "Los Santos", "Macaracas", "Pedasí", "Pocrí", "Tonosí"],
  },
  {
    name: "Panamá",
    districts: ["Panamá", "San Miguelito", "Balboa", "Chepo", "Chimán", "Taboga"],
  },
  {
    name: "Panamá Oeste",
    districts: ["Arraiján", "Capira", "Chame", "La Chorrera", "San Carlos"],
  },
  {
    name: "Veraguas",
    districts: [
      "Santiago",
      "Atalaya",
      "Calobre",
      "Cañazas",
      "La Mesa",
      "Las Palmas",
      "Mariato",
      "Montijo",
      "Río de Jesús",
      "San Francisco",
      "Santa Fe",
      "Soná",
    ],
  },
  {
    name: "Guna Yala",
    districts: ["Guna Yala"],
  },
  {
    name: "Emberá-Wounaan",
    districts: ["Cémaco", "Sambú"],
  },
  {
    name: "Ngäbe-Buglé",
    districts: [
      "Besikó",
      "Jirondai",
      "Kankintú",
      "Kusapín",
      "Mironó",
      "Müna",
      "Nole Duima",
      "Ñürüm",
      "Santa Catalina o Calovébora",
    ],
  },
];

export const PROVINCE_NAMES = PANAMA_PROVINCES.map((province) => province.name);

export function districtsOf(provinceName: string | undefined | null): string[] {
  if (!provinceName) return [];
  return PANAMA_PROVINCES.find((province) => province.name === provinceName)?.districts ?? [];
}

export function isValidProvince(provinceName: string): boolean {
  return PROVINCE_NAMES.includes(provinceName);
}
