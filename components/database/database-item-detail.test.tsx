import { act, renderWithIntl, screen, within } from "@/__tests__/test-utils";
import { routerMock } from "@/__tests__/mocks/i18n-navigation";
import { initialAppState, useAppStore } from "@/lib/stores/appStore";
import * as gameRegistry from "@/lib/game/registry";
import { getWorkstationPrice, getImportPrice } from "@/lib/calculations/math";
import { formatToUSD } from "@/lib/utils/formatToUSD";
import messages from "@/messages/en.json";
import userEvent from "@testing-library/user-event";
import DatabaseItemDetail from "./database-item-detail";
import DatabaseDetailModal from "./database-detail-modal";
import DatabaseDetailPage from "./database-detail-page";

vi.mock("@/i18n/navigation", async () => ({
  ...(await import("@/__tests__/mocks/i18n-navigation")),
  Link: ({
    href,
    children,
    className,
    replace,
  }: React.ComponentProps<"a"> & { replace?: boolean }) => (
    <a href={href} className={className} data-replace={String(replace)}>
      {children}
    </a>
  ),
}));

describe("Database details", () => {
  beforeEach(() => {
    useAppStore.setState({ ...initialAppState, _hasHydrated: true });
  });

  it("renders full details before hydration and then adopts saved price settings", () => {
    useAppStore.setState({ _hasHydrated: false });
    const product = gameRegistry.getGameData(initialAppState.gameVersion)
      .products.apple!;
    const { container } = renderWithIntl(
      <DatabaseItemDetail kind="product" name="apple" />,
    );
    expect(container.querySelector('[aria-busy="true"]')).toBeNull();
    expect(
      screen.getByRole("link", {
        name: `50 × ${messages.ingredients.appleSeeds}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        formatToUSD(
          getImportPrice(
            product.wholesalePrice,
            initialAppState.difficulty,
            initialAppState.tablePriceIndex,
          ),
        ),
      ),
    ).toBeInTheDocument();

    act(() =>
      useAppStore.setState({
        _hasHydrated: true,
        difficulty: "normal",
        tablePriceIndex: 1.6,
      }),
    );
    expect(
      screen.getByText(
        formatToUSD(getImportPrice(product.wholesalePrice, "normal", 1.6)),
      ),
    ).toBeInTheDocument();
  });

  it.each([
    ["product", "apple"],
    ["ingredient", "appleSeeds"],
    ["workstation", "gardenWorkstation"],
  ] as const)(
    "replaces the current popup entry when following %s relationships",
    (kind, name) => {
      renderWithIntl(
        <DatabaseDetailModal kind={kind} itemName={name}>
          <DatabaseItemDetail kind={kind} name={name} inDialog />
        </DatabaseDetailModal>,
      );
      for (const link of within(screen.getByRole("dialog")).getAllByRole(
        "link",
      )) {
        expect(link).toHaveAttribute("data-replace", "true");
      }
    },
  );

  it("keeps recipe quantities, ingredient links and thumbnails at the bottom of product details", () => {
    const { container } = renderWithIntl(
      <DatabaseItemDetail kind="product" name="apple" />,
    );
    const ingredientLink = screen.getByRole("link", {
      name: `50 × ${messages.ingredients.appleSeeds}`,
    });
    expect(ingredientLink).toHaveAttribute(
      "href",
      "/database/ingredients/appleSeeds",
    );
    expect(ingredientLink.querySelector("img")).toHaveAttribute(
      "src",
      expect.stringContaining("appleSeeds.png"),
    );
    expect(
      screen.getByRole("link", {
        name: messages.workstations.gardenWorkstation,
      }),
    ).toHaveAttribute("href", "/database/workstations/gardenWorkstation");
    expect(container.querySelector("article")?.lastElementChild).toBe(
      container.querySelector("#product-ingredients-heading")?.parentElement,
    );
  });

  it("keeps reverse product links, amounts and images in ingredient details", () => {
    renderWithIntl(<DatabaseItemDetail kind="ingredient" name="appleSeeds" />);
    const productLink = screen.getByRole("link", {
      name: messages.products.apple,
    });
    expect(productLink).toHaveAttribute("href", "/database/products/apple");
    expect(productLink.querySelector("img")).toHaveAttribute(
      "src",
      expect.stringContaining("apple.png"),
    );
    expect(productLink.closest("li")).toHaveTextContent("50 ×");
    expect(
      screen.queryByRole("link", { name: messages.products.beer }),
    ).not.toBeInTheDocument();
  });

  it("preserves alternatives and repeated recipe positions in both directions", () => {
    const gameData = gameRegistry.getGameData("1.0");
    vi.spyOn(gameRegistry, "getGameData").mockReturnValue({
      ...gameData,
      products: {
        apple: {
          ...gameData.products.apple!,
          ingredients: [{ water: 3, appleSeeds: 5 }, { water: 7 }],
        },
      },
    });
    const { rerender } = renderWithIntl(
      <DatabaseItemDetail kind="product" name="apple" />,
    );
    expect(
      screen.getByText(`${messages.database.details.oneOf}:`),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: `3 × ${messages.ingredients.water}` }),
    ).toHaveAttribute("href", "/database/ingredients/water");
    expect(
      screen.getByRole("link", { name: `7 × ${messages.ingredients.water}` }),
    ).toHaveAttribute("href", "/database/ingredients/water");

    rerender(<DatabaseItemDetail kind="ingredient" name="water" />);
    const usage = screen
      .getByRole("link", { name: messages.products.apple })
      .closest("li")!;
    const amounts = within(usage).getAllByRole("listitem");
    expect(amounts).toHaveLength(2);
    expect(amounts[0]).toHaveTextContent(
      `3 × (${messages.database.details.oneOf}:`,
    );
    expect(amounts[1]).toHaveTextContent("7 ×");
  });

  it("uses the same ingredient import price as the ingredients table", () => {
    useAppStore.setState({ tablePriceIndex: 1.6 });
    const ingredient = gameRegistry.getGameData("1.0").ingredients.appleSeeds!;
    renderWithIntl(<DatabaseItemDetail kind="ingredient" name="appleSeeds" />);
    expect(
      screen.getByText(
        formatToUSD(getImportPrice(ingredient.wholesalePrice, "easy")),
      ),
    ).toBeInTheDocument();
  });

  it("shows workstation machines, their total cost and only products made there", () => {
    const gameData = gameRegistry.getGameData("1.0");
    renderWithIntl(
      <DatabaseItemDetail kind="workstation" name="electronicsWorkstation" />,
    );
    const workstation = gameData.workstations.electronicsWorkstation!;
    expect(
      screen.getByText(formatToUSD(getWorkstationPrice(workstation, gameData))),
    ).toBeInTheDocument();
    for (const machine of workstation.neededMachines) {
      expect(screen.getByText(messages.machines[machine])).toBeInTheDocument();
    }
    const expectedLinks = Object.entries(gameData.products)
      .filter(
        ([, product]) => product?.workstation === "electronicsWorkstation",
      )
      .map(([name]) => `/database/products/${name}`)
      .sort();
    expect(
      screen
        .getAllByRole("link")
        .map((link) => link.getAttribute("href"))
        .sort(),
    ).toEqual(expectedLinks);
    expect(
      screen.queryByRole("link", { name: messages.products.apple }),
    ).not.toBeInTheDocument();
  });

  it("handles a workstation missing from the selected game data", () => {
    const gameData = gameRegistry.getGameData("1.0");
    vi.spyOn(gameRegistry, "getGameData").mockReturnValue({
      ...gameData,
      workstations: {},
    });
    renderWithIntl(
      <DatabaseItemDetail kind="workstation" name="electronicsWorkstation" />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("1.0");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it.each([
    ["product", "apple", "/database/products"],
    ["ingredient", "appleSeeds", "/database/ingredients"],
    ["workstation", "gardenWorkstation", "/database/machines#workstations"],
  ] as const)(
    "provides a bounded full %s page with a direct overview link",
    (kind, name, href) => {
      const { container } = renderWithIntl(
        <DatabaseDetailPage kind={kind}>
          <DatabaseItemDetail kind={kind} name={name} />
        </DatabaseDetailPage>,
      );
      expect(container.firstElementChild).toHaveClass("max-w-2xl");
      expect(
        screen.getByRole("link", {
          name: messages.database.details.backToOverview,
        }),
      ).toHaveAttribute("href", href);
    },
  );

  it("names the popup accessibly and navigates back when Escape is pressed", async () => {
    renderWithIntl(
      <DatabaseDetailModal kind="product" itemName="apple">
        <DatabaseItemDetail kind="product" name="apple" inDialog />
      </DatabaseDetailModal>,
    );
    expect(
      screen.getByRole("dialog", { name: messages.products.apple }),
    ).toBeInTheDocument();
    await userEvent.setup().keyboard("{Escape}");
    expect(routerMock.back).toHaveBeenCalledOnce();
  });
});
