import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MyEvents from "../pages/myEvents.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
    useSearchParams: jest.fn(() => [new URLSearchParams()]),
}));

jest.mock("../context/AuthContext.jsx", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../components/topNav", () => () => <div>TopNav</div>);
jest.mock("../components/sidebar", () => () => <div>Sidebar</div>);
jest.mock("../components/AdminSidebar.jsx", () => () => <div>AdminSidebar</div>);
jest.mock("../features/event/reviews/ReviewModal.jsx", () => () => <div>ReviewModal</div>);
jest.mock("../features/event/createEvent/CreateEventForm.jsx", () => () => <div>CreateEventForm</div>);
jest.mock("../features/event/homepageEvents/EventContainer", () => ({ events, onEventClick, onDeleteRsvpClick, onReviewClick }) => (
    <div>
        <p>EventContainer</p>
        {events.map((e) => (
            <div key={e._id}>
                <p>{e.name}</p>
                {onEventClick && <button onClick={() => onEventClick(e._id)}>view-{e.name}</button>}
                {onDeleteRsvpClick && <button onClick={() => onDeleteRsvpClick(e._id)}>cancel-rsvp-{e.name}</button>}
                {onReviewClick && <button onClick={() => onReviewClick(e)}>review-{e.name}</button>}
            </div>
        ))}
    </div>
));
jest.mock("../css/Home.css", () => ({}));

describe("MyEvents frontend tests", () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
        global.alert = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
    });

    // tests page structure, all four section headings should render
    test("renders all four event section headings", async () => {
        useAuth.mockReturnValue({
            activeUser: { role: "user" },
            activeUserId: "user_1",
        });

        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ events: [] }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ events: [] }),
            });

        render(<MyEvents />);

        expect(screen.getByText("Upcoming Hosting Events")).toBeInTheDocument();
        expect(screen.getByText("Upcoming Attending Events")).toBeInTheDocument();
        expect(screen.getByText("Previously Hosted Events")).toBeInTheDocument();
        expect(screen.getByText("Previously Attended Events")).toBeInTheDocument();
    });

    // tests loading state, page should show loading text before data arrives
    test("shows loading text while fetching events", async () => {
        useAuth.mockReturnValue({
            activeUser: { role: "user" },
            activeUserId: "user_1",
        });

        global.fetch.mockImplementation(() => new Promise(() => {}));

        render(<MyEvents />);

        const loadingElements = screen.getAllByText("Loading...");
        expect(loadingElements.length).toBe(4);
    });

    // tests API calls, should fetch all events and RSVP attending events on mount
    test("fetches events and rsvp data on mount", async () => {
        useAuth.mockReturnValue({
            activeUser: { role: "user" },
            activeUserId: "user_1",
        });

        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ events: [] }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ events: [] }),
            });

        render(<MyEvents />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/events");
            expect(global.fetch).toHaveBeenCalledWith("/api/rsvp/events?status=yes", {
                headers: { "x-user-id": "user_1" },
            });
        });
    });

    // tests logged-out guard, no fetches should happen without an active user
    test("clears all event lists and skips fetch when no active user", async () => {
        useAuth.mockReturnValue({
            activeUser: { role: "user" },
            activeUserId: null,
        });

        render(<MyEvents />);

        await waitFor(() => {
            expect(global.fetch).not.toHaveBeenCalled();
        });

        const emptyStates = screen.getAllByText("None to show.");
        expect(emptyStates.length).toBe(4);
        expect(screen.queryByText("EventContainer")).not.toBeInTheDocument();
    });

    // tests event navigation, clicking an event should navigate to its detail page
    test("navigates to event page when event is clicked", async () => {
        useAuth.mockReturnValue({
            activeUser: { role: "user", _id: "user_1" },
            activeUserId: "user_1",
        });

        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    events: [
                        {
                            _id: "event_1",
                            name: "Hosted Event",
                            createdBy: { _id: "user_1" },
                            date: "2030-06-15T00:00:00.000Z",
                            endTime: "20:00",
                        },
                    ],
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ events: [] }),
            });

        render(<MyEvents />);

        const viewButton = await screen.findByText("view-Hosted Event");
        fireEvent.click(viewButton);

        expect(mockNavigate).toHaveBeenCalledWith("/event/event_1");
    });

    // tests RSVP cancellation, should send PATCH with correct user header
    test("sends delete rsvp request with user header", async () => {
        useAuth.mockReturnValue({
            activeUser: { role: "user", _id: "user_1" },
            activeUserId: "user_1",
        });

        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ events: [] }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    events: [
                        {
                            eventId: {
                                _id: "event_2",
                                name: "Attending Event",
                                date: "2030-06-15T00:00:00.000Z",
                                endTime: "20:00",
                            },
                        },
                    ],
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: "RSVP removed" }),
            });

        render(<MyEvents />);

        const cancelButton = await screen.findByText("cancel-rsvp-Attending Event");
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/rsvp/event_2", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": "user_1",
                },
            });
        });
    });

    // tests review modal, clicking review on a past event should open the modal
    test("opens review modal when review button is clicked", async () => {
        useAuth.mockReturnValue({
            activeUser: { role: "user", _id: "user_1" },
            activeUserId: "user_1",
        });

        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ events: [] }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    events: [
                        {
                            eventId: {
                                _id: "event_3",
                                name: "Past Event",
                                date: "2020-01-01T00:00:00.000Z",
                                endTime: "18:00",
                            },
                        },
                    ],
                }),
            });

        render(<MyEvents />);

        const reviewButton = await screen.findByText("review-Past Event");
        fireEvent.click(reviewButton);

        await waitFor(() => {
            expect(screen.getByText("ReviewModal")).toBeInTheDocument();
        });
    });
});
