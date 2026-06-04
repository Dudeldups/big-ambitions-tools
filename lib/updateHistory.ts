import messages from "@/messages/en.json";

type UpdateId = keyof typeof messages.updateHistory;

export const updateHistory: { id: UpdateId; date: string }[] = [
  {
    id: "launch",
    date: "2026-05-03",
  },
  {
    id: "qotd",
    date: "2026-06-04",
  },
  {
    id: "update11",
    date: "2026-06-04",
  },
];
