import userEvent from "@testing-library/user-event";
import {
  fireEvent,
  renderWithIntl,
  screen,
  waitFor,
} from "@/__tests__/test-utils";
import { sonnerToastMock } from "@/__tests__/mocks/sonner";
import { set } from "idb-keyval";
import { useAppStore } from "@/lib/stores/appStore";
import { usePlaythroughStore } from "@/lib/stores/playthroughStore";
import { SettingsBackupDialog } from "./settings-backup-dialog";
import { exportSettingsBackup } from "@/lib/utils/settingsBackup";

vi.mock("sonner", () => import("@/__tests__/mocks/sonner"));

const upload = (text: string) => {
  const file = new File([text], "backup.json", { type: "application/json" });
  Object.defineProperty(file, "text", { value: async () => text });
  fireEvent.change(document.querySelector('input[type="file"]')!, {
    target: { files: [file] },
  });
};

const openDialog = async () => {
  useAppStore.setState({ _hasHydrated: true });
  usePlaythroughStore.setState({ _hasHydrated: true });
  const user = userEvent.setup();
  renderWithIntl(<SettingsBackupDialog />);
  await user.click(screen.getByRole("button", { name: /backup and restore/i }));
  return user;
};

describe("SettingsBackupDialog", () => {
  afterEach(() => vi.unstubAllGlobals());
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it.each([
    "[]",
    "{}",
    "null",
    JSON.stringify({
      "playthrough-storage": JSON.stringify({ state: { factories: "broken" } }),
    }),
  ])(
    "rejects invalid backup %s without writing to IndexedDB or closing the dialog",
    async (text) => {
      await openDialog();
      vi.mocked(set).mockClear();
      upload(text);
      await waitFor(() => expect(sonnerToastMock.error).toHaveBeenCalled());
      expect(set).not.toHaveBeenCalled();
      expect(sonnerToastMock.success).not.toHaveBeenCalled();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(document.querySelector('input[type="file"]')).toHaveValue("");
    },
  );

  it("offers a keyboard-accessible import button", async () => {
    const user = await openDialog();
    const input = document.querySelector('input[type="file"]')!;
    const pickFile = vi.spyOn(input as HTMLInputElement, "click");
    screen.getByRole("button", { name: "Import" }).focus();
    await user.keyboard("{Enter}");
    expect(pickFile).toHaveBeenCalledOnce();
  });

  it("disables backup controls until both stores have loaded", () => {
    renderWithIntl(<SettingsBackupDialog />);
    expect(
      screen.getByRole("button", { name: /backup and restore/i }),
    ).toBeDisabled();
  });

  it("restores valid data and prevents overlapping operations while reading the file", async () => {
    const user = await openDialog();
    const playthrough = usePlaythroughStore
      .getState()
      .createPlaythrough({
        characterName: "Restored",
        difficulty: "hard",
        gameVersion: "1.0",
      });
    const backup = exportSettingsBackup();
    usePlaythroughStore.setState({ playthroughs: [] });
    let readFile!: (text: string) => void;
    const file = new File([], "backup.json", { type: "application/json" });
    Object.defineProperty(file, "text", {
      value: () =>
        new Promise<string>((resolve) => {
          readFile = resolve;
        }),
    });
    fireEvent.change(document.querySelector('input[type="file"]')!, {
      target: { files: [file] },
    });
    expect(screen.getByRole("button", { name: "Export" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Import" })).toBeDisabled();
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    readFile(backup);
    await waitFor(() => expect(sonnerToastMock.success).toHaveBeenCalled());
    expect(
      usePlaythroughStore.getState().getPlaythroughById(playthrough.id)
        ?.characterName,
    ).toBe("Restored");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it.each([false, true])(
    "cleans up download URLs and anchors (download error: %s)",
    async (downloadFails) => {
      const user = await openDialog();
      let exported!: Blob;
      const revoke = vi.fn();
      vi.stubGlobal(
        "URL",
        class extends URL {
          static createObjectURL(blob: Blob) {
            exported = blob;
            return "blob:backup";
          }
          static revokeObjectURL = revoke;
        },
      );
      const click = vi
        .spyOn(HTMLAnchorElement.prototype, "click")
        .mockImplementation(function (this: HTMLAnchorElement) {
          expect(this.download).toMatch(
            /\d{4}-\d{2}-\d{2}-big-ambitions-settings\.json/,
          );
          if (downloadFails) throw new Error("Download failed");
        });
      await user.click(screen.getByRole("button", { name: "Export" }));
      expect(click).toHaveBeenCalledOnce();
      expect(revoke).toHaveBeenCalledWith("blob:backup");
      expect(document.querySelector("a[download]")).not.toBeInTheDocument();
      expect(
        downloadFails ? sonnerToastMock.error : sonnerToastMock.success,
      ).toHaveBeenCalledOnce();
      const text = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.readAsText(exported);
      });
      expect(Object.keys(JSON.parse(text)).sort()).toEqual([
        "app-storage",
        "playthrough-storage",
      ]);
    },
  );
});
