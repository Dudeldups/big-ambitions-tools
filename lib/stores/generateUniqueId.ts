function generateId(length = 6) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (b) => (b % 36).toString(36)).join("");
}

export function generateUniqueId(existingIds: Set<string>) {
  let id;

  do {
    id = generateId(6);
  } while (existingIds.has(id));

  return id;
}
