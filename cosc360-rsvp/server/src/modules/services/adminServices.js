import * as eventRepository from "../repository/eventRepository.js";
import * as rsvpRepository from "../repository/rsvpRepository.js";
import * as adminRepository from "../repository/adminRepository.js";

export async function getAnalytics() {
    const analytics = [
        {overview: getOverview()},

    ];

    return analytics;
}


async function getOverview() {
    const events = await eventRepository.getEvents(null);
    
    const totalEvents = events.length();
    let totalAttend = 0;
    let totalUpcoming = 0;
    let totalPast = 0;

    for (let event of events) {
        totalAttend += event.attendance;
        if (eventIsUpcoming(event.date, event.endTime)) {
            totalUpcoming += 1;
        } else if (!eventIsUpcoming(event.date, event.endTime)) {
            totalPast += 1;
        }
    }

    const users = await adminRepository.getAllUsers();
    const totalUsers = users.length();

    return overviewObj = {totalEvents: totalEvents, 
        totalAttendance: totalAttend, totalUpcoming: totalUpcoming, 
        totalPast: totalPast, totalUsers: totalUsers};
}

function eventIsUpcoming(eventDate, endTime) {
    const eventDateTime = new Date(eventDate);

    if (typeof endTime === "string" && endTime.includes(":")) {
        const [hours, minutes] = endTime.split(":").map(Number);
        if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
            eventDateTime.setHours(hours, minutes, 0, 0);
        }
    }
    return eventDateTime > new Date();
}
