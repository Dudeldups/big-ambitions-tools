import messages from "@/messages/en.json";

type UpdateId = keyof typeof messages.updateHistory;

export const updateHistory: { id: UpdateId; date: string }[] = [
  {
    id: "update13",
    date: "2026-09-30",
  },
  {
    id: "update12",
    date: "2026-09-11",
  },
  {
    id: "update10",
    date: "2026-08-30",
  },
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
