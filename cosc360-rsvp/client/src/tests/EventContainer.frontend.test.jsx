import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EventContainer from "../features/event/homepageEvents/EventContainer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

jest.mock("../context/AuthContext.jsx", () => ({
    useAuth: jest.fn(),
}));

describe("EventContainer frontend tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    // tests saved-state hydration, saved RSVP rows should pre-highlight bookmarks
    test("hydrates saved event ids and marks matching cards as wishlisted", async () => {
        useAuth.mockReturnValue({ activeUserId: "user_1" });
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                events: [{ eventId: { _id: "event_1" } }],
            }),
        });

        const events = [
            {
                _id: "event_1",
                name: "Saved Event",
                location: "Kelowna",
                date: "2030-06-15T00:00:00.000Z",
                startTime: "18:00",
                price: 15,
                reviews: [],
            },
            {
                _id: "event_2",
                name: "Unsaved Event",
                location: "Kelowna",
                date: "2030-06-16T00:00:00.000Z",
                startTime: "18:00",
                price: 20,
                reviews: [],
            },
        ];

        const { container } = render(<EventContainer events={events} />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/rsvp/events?status=saved", {
                headers: { "x-user-id": "user_1" },
            });
        });

        const wishlistButtons = container.querySelectorAll(".wishlist-btn");
        await waitFor(() => {
            expect(wishlistButtons[0]).toHaveClass("wishlisted");
            expect(wishlistButtons[1]).not.toHaveClass("wishlisted");
        });
    });

    // tests ratings display, average should be shown and empty reviews should be N/A
    test("shows average rating and N/A fallback correctly", async () => {
        useAuth.mockReturnValue({ activeUserId: "user_1" });
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ events: [] }),
        });

        const events = [
            {
                _id: "event_1",
                name: "Rated Event",
                location: "Kelowna",
                date: "2030-06-15T00:00:00.000Z",
                startTime: "18:00",
                price: 15,
                reviews: [{ rating: 5 }, { rating: 3 }],
            },
            {
                _id: "event_2",
                name: "No Reviews Event",
                location: "Kelowna",
                date: "2030-06-16T00:00:00.000Z",
                startTime: "18:00",
                price: 20,
                reviews: [],
            },
        ];

        render(<EventContainer events={events} />);
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });

        expect(screen.getByText("4.0")).toBeInTheDocument();
        expect(screen.getByText("N/A")).toBeInTheDocument();
    });

    // tests event click wiring, clicking a card should call parent handler with id
    test("calls onEventClick with event id when card is clicked", async () => {
        useAuth.mockReturnValue({ activeUserId: "user_1" });
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ events: [] }),
        });
        const onEventClick = jest.fn();

        render(
            <EventContainer
                events={[
                    {
                        _id: "event_1",
                        name: "Clickable Event",
                        location: "Kelowna",
                        date: "2030-06-15T00:00:00.000Z",
                        startTime: "18:00",
                        price: 15,
                        reviews: [],
                    },
                ]}
                onEventClick={onEventClick}
            />
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });

        fireEvent.click(screen.getByText("Clickable Event"));
        expect(onEventClick).toHaveBeenCalledWith("event_1");
    });
});
