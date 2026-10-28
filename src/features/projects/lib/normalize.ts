/**
 * Makes search forgiving across Latin and Persian input: case, accents, Arabic vs Persian
 * letter forms (ي/ی, ك/ک), diacritics and zero-width joiners all compare equal.
 */
export function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g, "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\u200e\u200f]/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
