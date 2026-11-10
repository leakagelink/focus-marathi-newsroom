import { QueryClient } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { canGoBack } from "@/components/BackButton";
import { routeTree } from "@/routeTree.gen";

const freshHistory = (href = "/") =>
  window.history.replaceState({ key: "k", __TSR_key: "k", __TSR_index: 0 }, "", href);

const makeRouter = () =>
  createRouter({ routeTree, context: { queryClient: new QueryClient() } });

// The page's own back control, not the browser chrome's.
const pageBack = () => within(screen.getByRole("main")).getByRole("button", { name: "मागें" });

// Every screen has to hand the visitor back to where they came from.
describe("Back navigation", () => {
  beforeEach(() => freshHistory());

  it("offers no way back on a fresh open, and one after coming from another screen", async () => {
    const router = makeRouter();
    await router.load();
    expect(canGoBack()).toBe(false);

    await router.navigate({ to: "/admin" });
    expect(router.state.location.pathname).toBe("/admin");
    expect(canGoBack()).toBe(true);
  });

  it("sends a visitor who opened the admin panel directly to the home screen", async () => {
    const router = makeRouter();
    await router.load();
    await router.navigate({ to: "/admin" });
    // Opening the admin panel straight away: nothing sits behind it in this tab.
    freshHistory("/admin");
    expect(canGoBack()).toBe(false);

    render(<RouterProvider router={router} />);
    await screen.findByText(/संपूर्ण नियंत्रण पॅनेल/);
    fireEvent.click(pageBack());

    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
  });

  it("returns the journalist from the portal to the login screen", async () => {
    const router = makeRouter();
    await router.load();
    await router.navigate({ to: "/journalist" });
    freshHistory("/journalist");

    render(<RouterProvider router={router} />);
    fireEvent.click(await screen.findByRole("button", { name: "OTP पाठवा" }));
    fireEvent.change(screen.getByPlaceholderText("••••"), { target: { value: "1234" } });
    fireEvent.click(screen.getByRole("button", { name: "लॉगिन करा" }));

    await screen.findByText("पत्रकार पोर्टल");
    fireEvent.click(pageBack());

    await waitFor(() => expect(screen.getByRole("button", { name: "OTP पाठवा" })).toBeTruthy());
  });
});
