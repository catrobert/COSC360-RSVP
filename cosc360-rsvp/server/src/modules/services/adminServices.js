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

async function getRevenueInsights() {
    const events = await eventRepository.getEvents(null);

    let totalRevenue = 0;

    const now = new Date();
    const currentMonthYear = `${(now.getMonth() + 1)} ${now.getFullYear()}`;

    let quarter1Count = 0;
    let quarter1Revenue = 0;
    let quarter2Count = 0;
    let quarter2Revenue = 0;
    let quarter3Count = 0;
    let quarter3Revenue = 0;
    let quarter4Count = 0;
    let quarter4Revenue = 0;

    for (let event of events) {
        totalRevenue += (event.attendance * event.price);

        if (withinLastYear(event.date)) {
            const quarter = getQuarter(event.date);

            switch(quarter) {
                case 1:
                    quarter1Count += 1;
                    quarter1Revenue += (event.attendance * event.price);
                    break;
                case 2:
                    quarter2Count += 1;
                    quarter2Revenue += (event.attendance * event.price);
                    break;
                 case 3:
                    quarter3Count += 1;
                    quarter3Revenue += (event.attendance * event.price);
                    break;
                case 4:
                    quarter4Count += 1;
                    quarter4Revenue += (event.attendance * event.price);
                    break;                                                           
            }
        }
    }

    const histogramVals = [
        { quarter: "Q1", count: quarter1Count, revenue: quarter1Revenue },
        { quarter: "Q2", count: quarter2Count, revenue: quarter2Revenue },
        { quarter: "Q3", count: quarter3Count, revenue: quarter3Revenue },
        { quarter: "Q4", count: quarter4Count, revenue: quarter4Revenue },
    ];  

    const revenueObj = {totalRevenue: totalRevenue, };

    return { ...revenueObj, histogram: histogramVals};
}

async function getRatingsInsights() {
    const events = await eventRepository.getEvents(null);
    const totalEvents = events.length;

    let totalRating = 0;
    let totalReviews = 0;

    let total1star = 0;
    let total2star = 0;
    let total3star = 0;
    let total4star = 0;
    let total5star = 0;

    for (let event of events) {
        totalRating += event.reviews.rating;
        totalReviews += event.reviews.length;

        for (let review of event.reviews) {
            const rating = review.rating;

            switch (rating) {
                case 1:
                    total1star += 1;
                    break;
                case 2:
                    total2star += 1;
                    break;
                case 3:
                    total3star += 1;
                    break;
                case 4:
                    total4star += 1;
                    break;
                case 5:
                    total5star += 1;
                    break;    
            }
        }
    }

    const ratingDistribution = [
            {rating: 1, count: total1star},
            {rating: 2, count: total2star},
            {rating: 3, count: total3star},
            {rating: 4, count: total4star},
            {rating: 5, count: total5star},
        ]

    const avgRating = totalRating / totalEvents;

    const ratingObj = {averageRating: avgRating, totalReviews: totalReviews};

    return {...ratingObj, ratingDistribution: ratingDistribution};
}

function withinLastYear(eventDate) {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return eventDate >= oneYearAgo;
}

function getQuarter(eventDate) {
    const eventMonth = eventDate.getMonth() + 1;
    const quarter = Math.ceil(eventMonth / 3);
    
    return quarter;
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
