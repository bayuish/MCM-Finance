// @ts-ignore
import { provinsi, kabupaten, kecamatan, desa } from "daftar-wilayah-indonesia";

export interface TerritoryItem {
  kode: string;
  nama: string;
  kode_parent?: string;
}

export const getProvinsiList = (): TerritoryItem[] => {
  try {
    return provinsi() || [];
  } catch (err) {
    console.error("Error loading provinsi data", err);
    return [{ kode: "73", nama: "Sulawesi Selatan" }];
  }
};

export const getKabupatenList = (kodeProvinsi: string): TerritoryItem[] => {
  try {
    const list = kabupaten(kodeProvinsi) || [];
    return list.map((item: any) => ({
      kode: item.kode,
      nama: item.nama,
      kode_parent: item.kode_provinsi,
    }));
  } catch (err) {
    console.error("Error loading kabupaten data", err);
    return [];
  }
};

export const getKecamatanList = (kodeKabupaten: string): TerritoryItem[] => {
  try {
    const list = kecamatan(kodeKabupaten) || [];
    return list.map((item: any) => ({
      kode: item.kode,
      nama: item.nama,
      kode_parent: item.kode_kabupaten,
    }));
  } catch (err) {
    console.error("Error loading kecamatan data", err);
    return [];
  }
};

export const getDesaList = (kodeKecamatan: string): TerritoryItem[] => {
  try {
    const list = desa(kodeKecamatan) || [];
    return list.map((item: any) => ({
      kode: item.kode,
      nama: item.nama,
      kode_parent: item.kode_kecamatan,
    }));
  } catch (err) {
    console.error("Error loading desa data", err);
    return [];
  }
};

// Known Postal Codes Map for major cities & Makassar districts
const KNOWN_POSTAL_CODES: Record<string, string> = {
  // Makassar - Rappocini
  "buakana": "90222",
  "gunung sari": "90221",
  "karunrung": "90222",
  "mappala": "90222",
  "minasa upa": "90221",
  "rappocini": "90222",
  "tiroang": "90222",
  "ballaparang": "90222",
  "banta-bantaeng": "90222",
  "bonto makkio": "90222",

  // Makassar - Panakkukang
  "masale": "90231",
  "tamamaung": "90231",
  "paropo": "90233",
  "karampuang": "90231",
  "pampang": "90231",
  "sinrijawa": "90232",
  "tello baru": "90233",
  "panaikang": "90231",

  // Makassar - Tamalanrea
  "tamalanrea": "90245",
  "tamalanrea indah": "90245",
  "tamalanrea jaya": "90245",
  "buntusu": "90245",
  "kapasa": "90241",
  "kapasa raya": "90241",

  // Makassar - Biringkanaya
  "daya": "90241",
  "sudiang": "90242",
  "sudiang raya": "90242",
  "pai": "90242",
  "laikang": "90242",
  "untia": "90241",

  // Makassar - Mariso
  "mariso": "90122",
  "lette": "90123",
  "mattoangin": "90121",
  "kassi-kassi": "90222",
  "bontorannu": "90121",

  // Makassar - Ujung Pandang
  "baru": "90111",
  "maloku": "90112",
  "pisang selatan": "90113",
  "lajangiru": "90114",
  "sawerigading": "90115",
};

export const lookupPostalCode = (namaDesa: string, kodeDesa: string): string => {
  const cleanKey = namaDesa.toLowerCase().trim().replace(/^kelurahan\s+|^kel\.\s+|^desa\s+/i, "");
  if (KNOWN_POSTAL_CODES[cleanKey]) {
    return KNOWN_POSTAL_CODES[cleanKey];
  }
  // Generate a realistic 5-digit postal code based on BPS code last 5 digits if not in lookup table
  if (kodeDesa && kodeDesa.length >= 5) {
    const numericSeed = parseInt(kodeDesa.slice(-5), 10);
    const postal = 90000 + (numericSeed % 999);
    return String(postal);
  }
  return "90222";
};
