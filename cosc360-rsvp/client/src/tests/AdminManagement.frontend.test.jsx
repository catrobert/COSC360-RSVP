import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminManagement from "../features/adminManagement/AdminManagement.jsx";
import { useAuth } from "../context/AuthContext.jsx";

jest.mock("../context/AuthContext.jsx", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../features/event/createEvent/CreateEventForm.jsx", () => () => <div>CreateEventForm</div>);

describe("AdminManagement search tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
        global.confirm = jest.fn(() => true);
        global.alert = jest.fn();

        useAuth.mockReturnValue({
            activeUser: { role: "admin", _id: "admin_1" },
            activeUserId: "admin_1",
        });
    });

    test("filters users by email", async () => {
        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    users: [
                        { _id: "u1", firstName: "Alex", lastName: "Stone", username: "alexs", email: "alex@mail.com", role: "user" },
                        { _id: "u2", firstName: "Sam", lastName: "Jones", username: "samj", email: "sam@mail.com", role: "user" },
                    ],
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ events: [] }),
            });

        render(<AdminManagement />);

        await waitFor(() => {
            expect(screen.getByText(/alex@mail.com/i)).toBeInTheDocument();
            expect(screen.getByText(/sam@mail.com/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText("Search users by name, username, or email..."), {
            target: { value: "sam@mail.com" },
        });

        expect(screen.queryByText(/alex@mail.com/i)).not.toBeInTheDocument();
        expect(screen.getByText(/sam@mail.com/i)).toBeInTheDocument();
    });

    test("filters events by description text", async () => {
        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ users: [] }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    events: [
                        { _id: "e1", name: "Tech Night", location: "Campus", description: "JavaScript meetup", date: "2030-01-01T00:00:00.000Z" },
                        { _id: "e2", name: "Art Expo", location: "Gallery", description: "Painting showcase", date: "2030-01-02T00:00:00.000Z" },
                    ],
                }),
            });

        render(<AdminManagement />);

        await waitFor(() => {
            expect(screen.getByText(/Tech Night/i)).toBeInTheDocument();
            expect(screen.getByText(/Art Expo/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText("Search posts/events by title, location, or description..."), {
            target: { value: "painting" },
        });

        expect(screen.queryByText(/Tech Night/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Art Expo/i)).toBeInTheDocument();
    });
});
