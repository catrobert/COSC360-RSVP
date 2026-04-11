import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Homepage from "../pages/home.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

let mockSearchParams = new URLSearchParams();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
    useSearchParams: jest.fn(),
}));

jest.mock("../context/AuthContext.jsx", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../components/topNav", () => () => <div data-testid="top-nav">TopNav</div>);
jest.mock("../components/sidebar", () => () => <div>Sidebar</div>);
jest.mock("../components/AdminSidebar", () => () => <div>AdminSidebar</div>);
jest.mock("../features/event/homepageEvents/EventContainer", () => ({ events }) => (
    <div data-testid="event-container">
        {events.map((event) => (
            <p key={event._id}>{event.name}</p>
        ))}
    </div>
));
jest.mock("../css/Home.css", () => ({}));

async function renderHomepage({ events, query = "" }) {
    mockSearchParams = new URLSearchParams(query ? `q=${query}` : "");

    global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events }),
    });

    render(<Homepage />);

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/events");
    });
}

describe("Homepage filtering tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
        useSearchParams.mockImplementation(() => [mockSearchParams]);
        useAuth.mockReturnValue({
            activeUser: { role: "user", _id: "user_1" },
            activeUserId: "user_1",
        });
    });

    test("renders date filter controls directly under top nav", async () => {
        await renderHomepage({
            events: [
                { _id: "e1", name: "Any Event", date: "2099-03-10T10:00:00.000Z" },
            ],
        });

        const topNav = screen.getByTestId("top-nav");
        const filtersRow = screen.getByLabelText("Homepage event filters");

        expect(topNav.nextSibling).toBe(filtersRow);
        expect(screen.getByLabelText("Date Range")).toBeInTheDocument();
        expect(screen.getByLabelText("Specific Date")).toBeInTheDocument();
    });

    test("filters events by date range (future and past)", async () => {
        await renderHomepage({
            events: [
                { _id: "e1", name: "Past Conference", date: "2000-01-02T10:00:00.000Z" },
                { _id: "e2", name: "Future Workshop", date: "2099-11-12T16:00:00.000Z" },
            ],
        });

        expect(screen.getByText("Past Conference")).toBeInTheDocument();
        expect(screen.getByText("Future Workshop")).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText("Date Range"), { target: { value: "future" } });

        await waitFor(() => {
            expect(screen.queryByText("Past Conference")).not.toBeInTheDocument();
            expect(screen.getByText("Future Workshop")).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText("Date Range"), { target: { value: "past" } });

        await waitFor(() => {
            expect(screen.getByText("Past Conference")).toBeInTheDocument();
            expect(screen.queryByText("Future Workshop")).not.toBeInTheDocument();
        });
    });

    test("filters events by a specific selected date", async () => {
        await renderHomepage({
            events: [
                { _id: "e1", name: "Date Match Event", date: "2099-05-15T18:30:00.000Z" },
                { _id: "e2", name: "Different Date Event", date: "2099-05-16T09:00:00.000Z" },
            ],
        });

        fireEvent.change(screen.getByLabelText("Specific Date"), {
            target: { value: "2099-05-15" },
        });

        await waitFor(() => {
            expect(screen.getByText("Date Match Event")).toBeInTheDocument();
            expect(screen.queryByText("Different Date Event")).not.toBeInTheDocument();
        });
    });

    test("search query applies within the already date-filtered result set", async () => {
        await renderHomepage({
            query: "music",
            events: [
                { _id: "e1", name: "Music Past", date: "2001-01-01T12:00:00.000Z", location: "Hall A", description: "Throwback" },
                { _id: "e2", name: "Music Future", date: "2099-01-01T12:00:00.000Z", location: "Hall B", description: "Upcoming" },
                { _id: "e3", name: "Sports Future", date: "2099-02-01T12:00:00.000Z", location: "Arena", description: "Games" },
            ],
        });

        await waitFor(() => {
            expect(screen.getByText("Music Past")).toBeInTheDocument();
            expect(screen.getByText("Music Future")).toBeInTheDocument();
            expect(screen.queryByText("Sports Future")).not.toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText("Date Range"), { target: { value: "future" } });

        await waitFor(() => {
            expect(screen.getByText("Music Future")).toBeInTheDocument();
            expect(screen.queryByText("Music Past")).not.toBeInTheDocument();
            expect(screen.queryByText("Sports Future")).not.toBeInTheDocument();
        });

        expect(global.fetch).toHaveBeenCalledWith("/api/events");
        expect(global.fetch).not.toHaveBeenCalledWith("/api/events?q=music");
    });
});
