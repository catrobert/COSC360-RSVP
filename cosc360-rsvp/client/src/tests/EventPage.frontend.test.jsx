import { render, screen, fireEvent } from "@testing-library/react";
import EventPage from "../pages/event.jsx";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

jest.mock("react-router-dom", () => ({
    useParams: jest.fn(),
}));

jest.mock("../context/AuthContext.jsx", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../components/topNav", () => () => <div>TopNav</div>);
jest.mock("../components/sidebar", () => () => <div>Sidebar</div>);
jest.mock("../components/AdminSidebar.jsx", () => () => <div>AdminSidebar</div>);
jest.mock("../components/LoginOverlay.jsx", () => () => <div>LoginOverlay</div>);
jest.mock("../features/event/reviews/ReviewModal.jsx", () => () => <div>ReviewModal</div>);
jest.mock("../features/event/singleEvent/SingleEventContainer", () => ({ event, ableToRsvp }) => (
    <div>
        <p>SingleEventContainer</p>
        <p>{event.name}</p>
        <p>{ableToRsvp ? "Can RSVP" : "Cannot RSVP"}</p>
    </div>
));
jest.mock("../features/event/reviews/ReviewCard", () => () => <div>ReviewCard</div>);
jest.mock("../features/event/createEvent/CreateEventForm.jsx", () => () => <div>CreateEventForm</div>);

describe("EventPage frontend tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
        global.alert = jest.fn();
        useParams.mockReturnValue({ id: "event_1" });
    });

    // tests loading path first, then event details render after fetch resolves
    test("shows loading first and then renders the event page", async () => {
        useAuth.mockReturnValue({
            activeUser: { role: "user" },
            activeUserId: "user_1",
            user: { id: "user_1" },
        });

        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ status: "yes" }],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    _id: "event_1",
                    name: "Single Event Title",
                    createdBy: { _id: "user_1" },
                    date: "2030-06-15T00:00:00.000Z",
                    endTime: "20:00",
                    price: 10,
                    description: "Event description",
                    reviews: [],
                }),
            });

        render(<EventPage />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
        expect(await screen.findByRole("heading", { name: "Single Event Title" })).toBeInTheDocument();
        expect(screen.getByText("SingleEventContainer")).toBeInTheDocument();
        expect(screen.getByText("ReviewCard")).toBeInTheDocument();
        expect(global.fetch).toHaveBeenCalledWith("/api/rsvp/events/event_1", {
            headers: { "x-user-id": "user_1" },
        });
        expect(global.fetch).toHaveBeenCalledWith("/api/events/event_1");
    });

    // tests creator path, owner should see edit and delete buttons
    test("shows edit and delete buttons for event owner", async () => {
        useAuth.mockReturnValue({
            activeUser: { role: "user" },
            activeUserId: "owner_1",
            user: { id: "owner_1" },
        });

        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ status: "yes" }],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    _id: "event_1",
                    name: "Owner Event",
                    createdBy: { _id: "owner_1" },
                    date: "2030-06-15T00:00:00.000Z",
                    endTime: "20:00",
                    price: 10,
                    description: "Event description",
                    reviews: [],
                }),
            });

        render(<EventPage />);

        expect(await screen.findByRole("heading", { name: "Owner Event" })).toBeInTheDocument();
        expect(screen.getByText("Edit Event")).toBeInTheDocument();
        expect(screen.getByText("Delete Event")).toBeInTheDocument();
    });

    // tests non-owner path, regular user should not see edit and delete controls
    test("hides edit and delete buttons for non-owner regular user", async () => {
        useAuth.mockReturnValue({
            activeUser: { role: "user" },
            activeUserId: "user_1",
            user: { id: "user_1" },
        });

        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ status: "saved" }],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    _id: "event_1",
                    name: "Someone Else Event",
                    createdBy: { _id: "owner_2" },
                    date: "2030-06-15T00:00:00.000Z",
                    endTime: "20:00",
                    price: 10,
                    description: "Event description",
                    reviews: [],
                }),
            });

        render(<EventPage />);

        expect(await screen.findByRole("heading", { name: "Someone Else Event" })).toBeInTheDocument();
        expect(screen.queryByText("Edit Event")).not.toBeInTheDocument();
        expect(screen.queryByText("Delete Event")).not.toBeInTheDocument();
    });

    // tests edit action, clicking edit should open the create/edit form modal
    test("opens edit form when owner clicks edit button", async () => {
        useAuth.mockReturnValue({
            activeUser: { role: "admin" },
            activeUserId: "admin_1",
            user: { id: "admin_1" },
        });

        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ status: "yes" }],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    _id: "event_1",
                    name: "Editable Event",
                    createdBy: { _id: "owner_2" },
                    date: "2030-06-15T00:00:00.000Z",
                    endTime: "20:00",
                    price: 10,
                    description: "Event description",
                    reviews: [],
                }),
            });

        render(<EventPage />);

        const editButton = await screen.findByText("Edit Event");
        fireEvent.click(editButton);
        expect(screen.getByText("CreateEventForm")).toBeInTheDocument();
    });
});
