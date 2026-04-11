import { fireEvent, render, screen } from "@testing-library/react";
import ResetPassword from "../features/login/ResetPassword.jsx";
import { resetPass } from "../features/login/api/Reset.js";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock("../features/login/api/Reset.js", () => ({
    resetPass: jest.fn(),
}));

describe("ResetPassword frontend tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("shows password length validation message for short passwords", async () => {
        render(<ResetPassword />);

        fireEvent.change(screen.getByPlaceholderText("Username"), {
            target: { value: "testuser" },
        });

        fireEvent.change(screen.getByPlaceholderText("New Password"), {
            target: { value: "short1" },
        });

        fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
            target: { value: "short1" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

        expect(await screen.findByText("Password must be at least 8 characters")).toBeInTheDocument();
        expect(resetPass).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("shows password length validation message for overly long passwords", async () => {
        render(<ResetPassword />);
        const tooLongPassword = "a".repeat(73);

        fireEvent.change(screen.getByPlaceholderText("Username"), {
            target: { value: "testuser" },
        });

        fireEvent.change(screen.getByPlaceholderText("New Password"), {
            target: { value: tooLongPassword },
        });

        fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
            target: { value: tooLongPassword },
        });

        fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

        expect(await screen.findByText("Password must be 72 characters or fewer")).toBeInTheDocument();
        expect(resetPass).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

});
