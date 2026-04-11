import * as eventRepository from "../repository/eventRepository.js";
import * as rsvpRepository from "../repository/rsvpRepository.js";
import * as userRepository from "../repository/userRepository.js";

export async function updateUserById (id, updates) {
    return await userRepository.updateUserById(id, updates);
}

export async function getAllUsers() {
    return await userRepository.getAllUsers();
}

export async function deleteUserById(id){
    return await userRepository.deleteUserById(id);
}

export async function getUserById(id) {
    return await userRepository.getUserById(id);
}


export async function getAnalytics() {
    const analytics = {
        overview: await getOverview(),
        eventInsights: await getEventsInsights(),
        revenueInsights: await getRevenueInsights(),
        ratingsInsights: await getRatingsInsights(),
        userInsights: await getUserInsights(),
    };
    return analytics;
}


async function getOverview() {
    const events = await eventRepository.findAll();
    
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

    const users = await userRepository.getAllUsers();
    const totalUsers = users.length;

    const overviewObj = {totalEvents: totalEvents, 
        totalAttendance: totalAttend, totalUpcoming: totalUpcoming, 
        totalPast: totalPast, totalUsers: totalUsers};
    
    return overviewObj;
}

async function getEventsInsights() {
    const events = await eventRepository.findAll();

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

    const users = await userRepository.getAllUsers();
    let attendedMoreThanOne = 0;

    for (let user of users) {
        const userRsvps = await rsvpRepository.findEventsByStatus(user._id, 'yes');
        let attendedEvents = 0;

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
    const events = await eventRepository.findAll();

    let totalRevenue = 0;
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
    const events = await eventRepository.findAll();

    let totalRating = 0;
    let totalReviews = 0;

    let total1star = 0;
    let total2star = 0;
    let total3star = 0;
    let total4star = 0;
    let total5star = 0;

    for (let event of events) {
        totalReviews += event.reviews.length;
        for (let review of event.reviews) {
            const rating = review.rating;
            totalRating += rating;

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

    let avgRating = 0;
    
    if (totalReviews === 0 || totalRating === 0) {
        avgRating = 'N/A';
    } else {
       avgRating = totalRating / totalReviews;
    }

    const ratingObj = {averageRating: avgRating, totalReviews: totalReviews};

    return {...ratingObj, ratingDistribution: ratingDistribution};
}

async function getUserInsights() {
    const users = await userRepository.getAllUsers();

    const totalUsers = users.length;
    let totalAge = 0;

    let maleCount = 0;
    let femaleCount = 0;
    let preferNotCount = 0;
    let otherCount = 0;

    for (let user of users) {    
        let bday = user.description?.[0]?.birthday;

        if (bday) {
            let userAge = getAge(bday);
            totalAge += userAge;
        } else {
            continue;
        }

        let gender = user.description[0].gender;

        if (gender) {
            switch(gender) {
                case "Male":
                    maleCount += 1;
                    break;
                case "Female":
                    femaleCount += 1;
                    break;
                case "Other":
                    otherCount += 1;
                    break;
                case "Prefer Not To Say":
                    preferNotCount +=1;
                    break;
            }
        } else {
            continue;
        }
    }

    let avgAge = 0;

    if (totalAge === 0 || totalUsers == 0) {
       avgAge = 'N/A'
    } else {
        avgAge = totalAge / totalUsers;
    }

    const genderDistribution = [
        {gender: "Male", count: maleCount},
        {gender: "Female", count: femaleCount},
        {gender: "Other", count: otherCount},
        {gender: "Prefer Not To Say", count: preferNotCount},
    ];

    return {averageAge: avgAge, genderDistribution: genderDistribution};
}

function getAge(bday) {
    const now = new Date();
    let age = now.getFullYear() - bday.getFullYear();

    const hadBdayThisYear = now.getMonth() > bday.getMonth() || (now.getMonth() === bday.getMonth() && now.getDate() >= bday.getDate());

    if (!hadBdayThisYear) {
        age -= 1;
    }

    return age;
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
