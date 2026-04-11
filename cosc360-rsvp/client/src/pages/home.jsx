import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import EventContainer from "../features/event/homepageEvents/EventContainer";
import Sidebar from "../components/sidebar";
import AdminSidebar from "../components/AdminSidebar";
import TopNav from "../components/topNav";
import "../css/Home.css";
import { useAuth } from "../context/AuthContext.jsx";

function Homepage() {
    const [events, setEvents] = useState([]);
    const [dateFilterType, setDateFilterType] = useState("all");
    const [specificDate, setSpecificDate] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { activeUser } = useAuth();

    const query = searchParams.get("q"); // get the search params sent over from search bar in top nav component

    function handleEventClick(eventId) {
        if (!eventId) return;
        navigate(`/event/${eventId}`);
    }

    function getLocalDateKey(inputDate) {
        const date = new Date(inputDate);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await fetch("/api/events");
                const data = await response.json();

                if (!response.ok) {
                    console.log("Error fetching events: ", data.error);
                    return;
                }

                setEvents(data.events ?? data);

            } catch (e) {
                console.log("Error fetching events: " + e);
            }
        }

        fetchEvents();

    }, [])

    const filteredEvents = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const normalizedQuery = (query || "").trim().toLowerCase();

        return events
            .filter((event) => {
                const eventDate = new Date(event?.date);

                if (Number.isNaN(eventDate.getTime())) {
                    return dateFilterType === "all" && !specificDate;
                }

                if (dateFilterType === "past" && eventDate >= today) {
                    return false;
                }

                if (dateFilterType === "future" && eventDate < today) {
                    return false;
                }

                if (specificDate) {
                    const eventDateKey = getLocalDateKey(eventDate);
                    if (eventDateKey !== specificDate) {
                        return false;
                    }
                }

                return true;
            })
            .filter((event) => {
                if (!normalizedQuery) {
                    return true;
                }

                const searchableText = [event?.name, event?.location, event?.description]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(normalizedQuery);
            });
    }, [events, dateFilterType, specificDate, query]);

    return (
        <div className="homepage-layout">
            {activeUser?.role === 'admin' ? (<AdminSidebar />) : (<Sidebar />)}
            <div className="main-content">
                <TopNav />
                <div className="homepage-filters" aria-label="Homepage event filters">
                    <div className="homepage-filter-group">
                        <label htmlFor="event-date-range-filter">Date Range</label>
                        <select
                            id="event-date-range-filter"
                            value={dateFilterType}
                            onChange={(e) => setDateFilterType(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="future">Future</option>
                            <option value="past">Past</option>
                        </select>
                    </div>

                    <div className="homepage-filter-group">
                        <label htmlFor="event-specific-date-filter">Specific Date</label>
                        <input
                            id="event-specific-date-filter"
                            type="date"
                            value={specificDate}
                            onChange={(e) => setSpecificDate(e.target.value)}
                        />
                    </div>
                </div>

                <EventContainer events={filteredEvents} onEventClick={handleEventClick} />
            </div>
        </div>
    );
}

export default Homepage;