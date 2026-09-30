import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const messageDirectory = join(process.cwd(), "messages");
type MessageObject = { [key: string]: string | MessageObject };
function flatten(messages: MessageObject, prefix = ""): Record<string, string> {
  return Object.fromEntries(
    Object.entries(messages).flatMap(([key, value]) => {
      if (key.startsWith("__")) return [];
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof value === "string"
        ? [[path, value]]
        : Object.entries(flatten(value, path));
    }),
  );
}
const catalogues = readdirSync(messageDirectory)
  .filter((file) => file.endsWith(".json"))
  .map((file) => ({
    locale: file.replace(".json", ""),
    messages: flatten(
      JSON.parse(readFileSync(join(messageDirectory, file), "utf8")),
    ),
  }));
const english = catalogues.find(({ locale }) => locale === "en")!.messages;

describe("message catalogue coverage", () => {
  it.each(catalogues)(
    "$locale includes every English message key",
    ({ messages }) => {
      const missing = Object.keys(english).filter(
        (key) => !messages[key]?.trim(),
      );
      expect(missing).toEqual([]);
    },
  );
});
