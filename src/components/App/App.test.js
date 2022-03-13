import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "src/components/App";

/* Usually here I would mock the individual functions in the API module if they
were hitting a real API, but since the module returns vanilla objects from a hard
coded source, I mock the Math random return value so that I can guarantee no 
errors in tests unless I specifically want them */
beforeEach(() => {
  jest.spyOn(global.Math, "random").mockReturnValue(0.1);
});

afterEach(() => {
  jest.spyOn(global.Math, "random").mockRestore();
});

test("shows properties filtered by the search term", async () => {
  render(<App />);

  const searchInput = screen.getByPlaceholderText("Address");
  const searchButton = screen.getByText("Search", { selector: "button" });

  userEvent.type(searchInput, "St");
  userEvent.click(searchButton);

  // Wait for one of the results
  await screen.findByText("Forsmannstraße 5");

  expect(screen.getAllByTestId("property-search-row").length).toBe(5);
});

test("shows properties filtered by the property type", async () => {
  render(<App />);

  const searchInput = screen.getByPlaceholderText("Address");
  const searchButton = screen.getByText("Search", { selector: "button" });
  const detatchedHouseType = await screen.findByText("Detached house");

  userEvent.type(searchInput, "St");
  userEvent.click(searchButton);

  // Wait for one of the results
  await screen.findByText("Forsmannstraße 5");

  userEvent.click(detatchedHouseType);

  await waitFor(() =>
    expect(screen.getAllByTestId("property-search-row").length).toBe(2)
  );
});

test("shows a toast on various API errors", async () => {
  /*this is cheating since I know the API determines errors like this - in a real
  app I would mock fetch/axios/other library to throw an error. */
  jest.spyOn(global.Math, "random").mockReturnValue(1);

  render(<App />);

  const searchInput = screen.getByPlaceholderText("Address");
  const searchButton = screen.getByText("Search", { selector: "button" });
  userEvent.type(searchInput, "St");
  userEvent.click(searchButton);

  await screen.findByText("An unexpected error occurred");
});

test("it adds and removes selected items to the selected table", async () => {
  render(<App />);

  const searchInput = screen.getByPlaceholderText("Address");
  const searchButton = screen.getByText("Search", { selector: "button" });
  userEvent.type(searchInput, "St");
  userEvent.click(searchButton);

  await screen.findByText("Forsmannstraße 5");

  const checkboxes = screen.getAllByTestId("property-checkbox");

  checkboxes.forEach((checkbox) => {
    userEvent.click(checkbox);
  });

  expect(screen.getAllByTestId("property-results-row").length).toBe(5);

  checkboxes.forEach((checkbox) => {
    userEvent.click(checkbox);
  });

  expect(screen.queryAllByTestId("property-results-row").length).toBe(0);
});
