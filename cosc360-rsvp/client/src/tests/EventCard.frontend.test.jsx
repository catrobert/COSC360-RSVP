import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EventCard from "../features/event/homepageEvents/EventCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

jest.mock("../context/AuthContext.jsx", () => ({
    useAuth: jest.fn(),
}));

describe("EventCard frontend tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
        global.alert = jest.fn();
    });

    // tests happy path render, core event details should show up on the card
    test("renders event content and formatted price", () => {
        useAuth.mockReturnValue({ activeUserId: "user_1" });

        render(
            <EventCard
                eventId="event_1"
                name="Frontend Meetup"
                location="Kelowna"
                date="APR 08, 2026 - 5:00 PM"
                rating={4}
                price={12.5}
            />
        );

        expect(screen.getByText("Frontend Meetup")).toBeInTheDocument();
        expect(screen.getByText("Kelowna")).toBeInTheDocument();
        expect(screen.getByText("APR 08, 2026 - 5:00 PM")).toBeInTheDocument();
        expect(screen.getByText("$12.50 / ticket")).toBeInTheDocument();
        expect(screen.getByText("4.0")).toBeInTheDocument();
    });

    // tests auth guard, user should be prompted to log in before saving
    test("shows login alert and skips network call when user is not logged in", async () => {
        useAuth.mockReturnValue({ activeUserId: null });
        const { container } = render(<EventCard eventId="event_1" name="Needs Login" />);

        const wishlistButton = container.querySelector(".wishlist-btn");
        fireEvent.click(wishlistButton);

        expect(global.alert).toHaveBeenCalledWith("Please log in to save events.");
        expect(global.fetch).not.toHaveBeenCalled();
    });

    // tests save toggle path, clicking bookmark should update local wishlist state
    test("toggles wishlist and notifies parent when update succeeds", async () => {
        useAuth.mockReturnValue({ activeUserId: "user_1" });
        global.fetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ message: "updated" }),
        });
        const onWishlistChanged = jest.fn();

        const { container } = render(
            <EventCard
                eventId="event_1"
                name="Save Me"
                onWishlistChanged={onWishlistChanged}
                initialWishlisted={false}
            />
        );

        const wishlistButton = container.querySelector(".wishlist-btn");
        fireEvent.click(wishlistButton);

        await waitFor(() => {
            expect(onWishlistChanged).toHaveBeenCalledWith("event_1", true);
            expect(wishlistButton).toHaveClass("wishlisted");
        });
    });
});
