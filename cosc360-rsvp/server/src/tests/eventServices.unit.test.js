import { jest } from "@jest/globals";

const mockEventRepository = {
    findAll: jest.fn(),
    findBySearchTerm: jest.fn(),
    findEvent: jest.fn(),
    createEvent: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
    findReview: jest.fn(),
    createReview: jest.fn(),
};

const mockRsvpRepository = {
    findRSVP: jest.fn(),
};

jest.unstable_mockModule("../modules/repository/eventRepository.js", () => mockEventRepository);
jest.unstable_mockModule("../modules/repository/rsvpRepository.js", () => mockRsvpRepository);

const eventServices = await import("../modules/services/eventServices.js");

describe("eventServices unit tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // tests passthrough list path, getEvents without query should use findAll
    test("getEvents without query calls findAll", async () => {
        mockEventRepository.findAll.mockResolvedValue([{ name: "Event A" }]);

        const result = await eventServices.getEvents();

        expect(mockEventRepository.findAll).toHaveBeenCalledTimes(1);
        expect(mockEventRepository.findBySearchTerm).not.toHaveBeenCalled();
        expect(result).toEqual([{ name: "Event A" }]);
    });

    // tests search path, getEvents with query should use findBySearchTerm
    test("getEvents with query calls findBySearchTerm", async () => {
        mockEventRepository.findBySearchTerm.mockResolvedValue([{ name: "JS Event" }]);

        const result = await eventServices.getEvents("javascript");

        expect(mockEventRepository.findBySearchTerm).toHaveBeenCalledWith("javascript");
        expect(mockEventRepository.findAll).not.toHaveBeenCalled();
        expect(result).toEqual([{ name: "JS Event" }]);
    });

    // tests create mapping, service should build event payload before repository call
    test("createEvent maps payload fields and calls repository", async () => {
        mockEventRepository.createEvent.mockResolvedValue({ _id: "event_1" });
        const userId = "user_123";
        const payload = {
            name: "Create Unit Test Event",
            date: "2030-08-15T00:00:00.000Z",
            location: "Kelowna",
            startTime: "17:00",
            endTime: "19:00",
            price: "20.50",
            description: "Service mapping test",
            image: "/uploads/pic.jpg",
        };

        await eventServices.createEvent(payload, userId);

        expect(mockEventRepository.createEvent).toHaveBeenCalledTimes(1);
        expect(mockEventRepository.createEvent).toHaveBeenCalledWith({
            name: "Create Unit Test Event",
            date: new Date("2030-08-15T00:00:00.000Z"),
            location: "Kelowna",
            startTime: "17:00",
            endTime: "19:00",
            attendance: 0,
            createdBy: userId,
            price: 20.5,
            description: "Service mapping test",
            reviews: [],
            image: "/uploads/pic.jpg",
        });
    });

    // tests update guard path, missing event should return null
    test("updateEvent returns null when event does not exist", async () => {
        mockEventRepository.findEvent.mockResolvedValue(null);

        const result = await eventServices.updateEvent("missing_id", {}, "user_1", "user");

        expect(result).toBeNull();
        expect(mockEventRepository.updateEvent).not.toHaveBeenCalled();
    });

    // tests delete missing path, service returns null when event is absent
    test("deleteEvent returns null when event does not exist", async () => {
        mockEventRepository.findEvent.mockResolvedValue(null);

        const result = await eventServices.deleteEvent("missing_id", "user_1", "user");

        expect(result).toBeNull();
        expect(mockEventRepository.deleteEvent).not.toHaveBeenCalled();
    });

    // tests delete permission path, non-admin non-owner should get forbidden error
    test("deleteEvent throws Forbidden for non-owner non-admin", async () => {
        mockEventRepository.findEvent.mockResolvedValue({
            createdBy: { _id: { toString: () => "owner_1" } },
        });

        await expect(
            eventServices.deleteEvent("event_1", "different_user", "user")
        ).rejects.toThrow("Forbidden");

        expect(mockEventRepository.deleteEvent).not.toHaveBeenCalled();
    });

    // tests delete admin override path, admin can delete someone else's event
    test("deleteEvent allows admin to delete another user's event", async () => {
        mockEventRepository.findEvent.mockResolvedValue({
            createdBy: { _id: { toString: () => "owner_1" } },
        });
        mockEventRepository.deleteEvent.mockResolvedValue({ _id: "event_1" });

        const result = await eventServices.deleteEvent("event_1", "admin_1", "admin");

        expect(mockEventRepository.deleteEvent).toHaveBeenCalledWith("event_1");
        expect(result).toEqual({ _id: "event_1" });
    });

    // tests permission path, non-admin non-owner should get forbidden error
    test("updateEvent throws Forbidden for non-owner non-admin", async () => {
        mockEventRepository.findEvent.mockResolvedValue({
            createdBy: { _id: { toString: () => "owner_1" } },
        });

        await expect(
            eventServices.updateEvent("event_1", {}, "different_user", "user")
        ).rejects.toThrow("Forbidden");

        expect(mockEventRepository.updateEvent).not.toHaveBeenCalled();
    });

    // tests admin override path, admin can update someone else's event
    test("updateEvent allows admin and forwards mapped fields", async () => {
        mockEventRepository.findEvent.mockResolvedValue({
            createdBy: { _id: { toString: () => "owner_1" } },
        });
        mockEventRepository.updateEvent.mockResolvedValue({ _id: "event_1" });

        const payload = {
            name: "Updated Event",
            date: "2032-01-01T00:00:00.000Z",
            location: "Vernon",
            startTime: "10:00",
            endTime: "12:00",
            price: "33.25",
            description: "Updated by admin",
        };

        await eventServices.updateEvent("event_1", payload, "admin_1", "admin");

        expect(mockEventRepository.updateEvent).toHaveBeenCalledWith("event_1", {
            name: "Updated Event",
            date: new Date("2032-01-01T00:00:00.000Z"),
            location: "Vernon",
            startTime: "10:00",
            endTime: "12:00",
            price: 33.25,
            description: "Updated by admin",
        });
    });

    // tests review not-found path, should throw when event is missing
    test("createReview throws when event is not found", async () => {
        mockEventRepository.findEvent.mockResolvedValue(null);

        await expect(eventServices.createReview({}, "event_1", "user_1")).rejects.toThrow(
            "Event not found"
        );
    });

    // tests rsvp gate, user must have RSVP yes before reviewing
    test("createReview throws when RSVP is missing or not yes", async () => {
        mockEventRepository.findEvent.mockResolvedValue({
            date: new Date("2000-01-01T00:00:00.000Z"),
            endTime: "10:00",
        });
        mockRsvpRepository.findRSVP.mockResolvedValue({ status: "saved" });

        await expect(
            eventServices.createReview({ rating: 5 }, "event_1", "user_1")
        ).rejects.toThrow("You must RSVP yes before reviewing this event!");
    });

    // tests time gate, review should fail if the event has not ended yet
    test("createReview throws when event has not ended", async () => {
        mockEventRepository.findEvent.mockResolvedValue({
            date: new Date("2999-01-01T00:00:00.000Z"),
            endTime: "23:59",
        });
        mockRsvpRepository.findRSVP.mockResolvedValue({ status: "yes" });

        await expect(
            eventServices.createReview({ rating: 4 }, "event_1", "user_1")
        ).rejects.toThrow("You can only review events that have ended!");
    });

    // tests duplicate guard, user should not be able to review same event twice
    test("createReview throws when review already exists", async () => {
        mockEventRepository.findEvent.mockResolvedValue({
            date: new Date("2000-01-01T00:00:00.000Z"),
            endTime: "10:00",
        });
        mockRsvpRepository.findRSVP.mockResolvedValue({ status: "yes" });
        mockEventRepository.findReview.mockResolvedValue({ _id: "review_1" });

        await expect(
            eventServices.createReview({ rating: 5 }, "event_1", "user_1")
        ).rejects.toThrow("You have already reviewed this event!");
    });

    // tests review happy path, valid review should be sent to repository
    test("createReview creates review when all checks pass", async () => {
        mockEventRepository.findEvent.mockResolvedValue({
            date: new Date("2000-01-01T00:00:00.000Z"),
            endTime: "10:00",
        });
        mockRsvpRepository.findRSVP.mockResolvedValue({ status: "yes" });
        mockEventRepository.findReview.mockResolvedValue(null);
        mockEventRepository.createReview.mockResolvedValue({ _id: "review_2" });

        const result = await eventServices.createReview(
            { rating: 5, comment: "Great event" },
            "event_1",
            "user_1"
        );

        expect(mockEventRepository.createReview).toHaveBeenCalledWith(
            {
                userId: "user_1",
                rating: 5,
                comment: "Great event",
            },
            "event_1"
        );
        expect(result).toEqual({ _id: "review_2" });
    });
});
