type SearchEntry = {
  name: string;
  title: string;
  client: string;
  category: string;
  year: string;
  status: string;
};

function normalize(value: string) {
  return value.toLocaleLowerCase("sr").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").trim();
}

export function filterPortfolioEntries<T extends SearchEntry>(
  entries: T[],
  query: string,
  category: string,
  aliases: Record<string, string> = {},
) {
  const needle = normalize(query);
  return entries.filter((entry) => {
    if (category && entry.category !== category) return false;
    const haystack = [entry.name, entry.title, entry.client, entry.category, entry.year, entry.status, aliases[entry.category] || ""].join(" ");
    return !needle || normalize(haystack).includes(needle);
  });
}
