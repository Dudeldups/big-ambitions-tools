import messages from "@/messages/en.json";

type UpdateId = keyof typeof messages.updateHistory;

export const updateHistory: { id: UpdateId; date: string }[] = [
  {
    id: "launch",
    date: "2026-03-10",
  },
];
