import { render, screen, waitFor } from "@testing-library/react";
import MyEvents from "../pages/myEvents.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

jest.mock("../context/AuthContext.jsx", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../components/topNav", () => () => <div>TopNav</div>);
jest.mock("../components/sidebar", () => () => <div>Sidebar</div>);
jest.mock("../components/AdminSidebar.jsx", () => () => <div>AdminSidebar</div>);
jest.mock("../features/event/reviews/ReviewModal.jsx", () => () => <div>ReviewModal</div>);
jest.mock("../features/event/createEvent/CreateEventForm.jsx", () => () => <div>CreateEventForm</div>);
jest.mock("../features/event/homepageEvents/EventContainer", () => ({ events }) => (
    <div>
        <p>EventContainer</p>
        {events.map((e) => (
            <p key={e._id}>{e.name}</p>
        ))}
    </div>
));
jest.mock("../css/Home.css", () => ({}));

describe("MyEvents frontend tests", () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
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

        const containers = screen.getAllByText("EventContainer");
        expect(containers.length).toBe(4);
    });
});
