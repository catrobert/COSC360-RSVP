import { render, screen, fireEvent } from "@testing-library/react";
import SavedEvents from "../pages/savedEvents.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
    useSearchParams: jest.fn(),
}));

jest.mock("../context/AuthContext.jsx", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../components/topNav", () => () => <div>TopNav</div>);
jest.mock("../components/sidebar", () => () => <div>Sidebar</div>);
jest.mock("../components/AdminSidebar", () => () => <div>AdminSidebar</div>);

jest.mock("../features/event/homepageEvents/EventContainer", () => {
    return function MockEventContainer({ events, onSavedStateChange }) {
        return (
            <div>
                <div>EventContainer</div>
                {events.map((event) => (
                    <p key={event._id}>{event.name}</p>
                ))}
                <button
                    onClick={() => {
                        if (!events[0]) return;
                        onSavedStateChange?.(events[0]._id, false);
                    }}
                >
                    Unsave first
                </button>
            </div>
        );
    };
});

describe("SavedEvents page frontend tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
        useNavigate.mockReturnValue(jest.fn());
        useSearchParams.mockReturnValue([new URLSearchParams("")]);
        useAuth.mockReturnValue({
            activeUser: { role: "user" },
            activeUserId: "user_1",
        });
    });

    // tests saved-events load path, page should render saved items from RSVP payload
    test("shows saved events after fetch completes", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                events: [
                    { eventId: { _id: "event_1", name: "Saved Music Night" } },
                    { eventId: { _id: "event_2", name: "Saved Coding Meetup" } },
                ],
            }),
        });

        render(<SavedEvents />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
        expect(await screen.findByText("Saved Music Night")).toBeInTheDocument();
        expect(screen.getByText("Saved Coding Meetup")).toBeInTheDocument();
        expect(global.fetch).toHaveBeenCalledWith("/api/rsvp/events?status=saved", {
            headers: { "x-user-id": "user_1" },
        });
    });

    // tests empty-state path, should show empty message when there are no saved events
    test("shows empty state when user has no saved events", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ events: [] }),
        });

        render(<SavedEvents />);

        expect(await screen.findByText("No saved events yet.")).toBeInTheDocument();
    });

    // tests unsave behavior, removing first saved event should update the page list
    test("removes event from list when unsaved from saved page", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                events: [
                    { eventId: { _id: "event_1", name: "Saved Music Night" } },
                    { eventId: { _id: "event_2", name: "Saved Coding Meetup" } },
                ],
            }),
        });

        render(<SavedEvents />);

        expect(await screen.findByText("Saved Music Night")).toBeInTheDocument();
        expect(screen.getByText("Saved Coding Meetup")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Unsave first"));

        expect(screen.queryByText("Saved Music Night")).not.toBeInTheDocument();
        expect(screen.getByText("Saved Coding Meetup")).toBeInTheDocument();
    });
});
