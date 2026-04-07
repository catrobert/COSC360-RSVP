import * as eventRepository from "../repository/eventRepository.js";
import * as rsvpRepository from "../repository/rsvpRepository.js";
import * as adminRepository from "../repository/adminRepository.js";

export async function getAnalytics() {
    const analytics = [
        {overview: getOverview()},
        {eventInsights: getEventsInsights()},

    ];

    return analytics;
}


async function getOverview() {
    const events = await eventRepository.getEvents(null);
    
    const totalEvents = events.length;
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
    const totalUsers = users.length;

    const overviewObj = {totalEvents: totalEvents, 
        totalAttendance: totalAttend, totalUpcoming: totalUpcoming, 
        totalPast: totalPast, totalUsers: totalUsers};
    
    return overviewObj;
}

async function getEventsInsights() {
    const events = await eventRepository.getEvents(null);

    const totalEvents = events.length;
    let totalAttendance = 0;
    let totalPrice = 0;

    for (let event of events) {
        totalAttendance += event.attendance;
        totalPrice += event.price;
    }

    const avgAttendance = totalAttendance / totalEvents; 
    const avgPrice = totalPrice / totalEvents;

    const bestAttendance = events.reduce((prev, current) => {
        return (prev.attendance > current.attendance) ? prev : current;
    });

    const bestByAttendance = bestAttendance.name;

    const bestReviews = events.reduce((prev, current) => {
        return (prev.reviews.rating > current.reviews.rating) ? prev : current;
    });

    const bestByReviews = bestReviews.name;

    const users = await adminRepository.getAllUsers();
    let attendedMoreThanOne = 0;

    for (let user in users) {
        const userRsvps = await rsvpRepository.findEventsByStatus(user._id, 'yes');
        const attendedEvents = 0;

        userRsvps.forEach(rsvp => {
            if (eventIsUpcoming(rsvp.eventId.date, rsvp.eventId.endTime)) {
                attendedEvents += 1;
            }
        })

        if (attendedEvents > 1) {
            attendedMoreThanOne += 1;
        }
    }

    const eventsObj = {averageAttendance: avgAttendance, averagePrice: avgPrice, 
        mostPopularByAttendance: bestByAttendance, mostPopularByReviews: bestByReviews, 
        attendedMoreThanOne: attendedMoreThanOne};

    return eventsObj;
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
