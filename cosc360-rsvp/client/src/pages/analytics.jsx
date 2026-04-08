import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TopNav from "../components/topNav";
import "../css/Home.css";
import "../css/adminAnalytics.css"
import { CalendarPlus2, BadgeCheck, UserCheck, ClockAlert, CalendarSync } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

function Analytics() {
    // const overviewInsights = [
    //     {label: "Total Number of Events", statistic: 2, icon: CalendarPlus2},
    //     {label: "Total Event Attendance", statistic: 3, icon: BadgeCheck},
    //     {label: "Total Registered Users", statistic: 4, icon: UserCheck},
    //     {label: "Total Upcoming Events", statistic: 5, icon: ClockAlert},
    //     {label: "Total Past Events", statistic: 6, icon: CalendarSync},
    // ];

    // const eventInsights = [
    //     {label: "Most Popular Event by Attendance", statistic: 2, icon: CalendarPlus2},
    //     {label: "Most Popular Event by Rating", statistic: 3, icon: BadgeCheck},
    //     {label: "Average Ticket Price", statistic: 3, icon: BadgeCheck},
    //     {label: "Average Attendance per Event", statistic: 3, icon: BadgeCheck},
    //     {label: "Users Who Attended More Than One Event", statistic: 3, icon: BadgeCheck},
    // ];

    // const revenueInsights = [
    //     {label: "All Time Revenue", statistic: 2, icon: CalendarPlus2},
    //     {label: "Revenue By Quarter", statistic: 3, icon: BadgeCheck},
    // ];

    // const ratingsInsights = [
    //     {label: "Average Event Rating", statistic: 2, icon: CalendarPlus2},
    //     {label: "Total Number of Reviews", statistic: 3, icon: BadgeCheck},
    //     {label: "Rating Distribution", statistic: 3, icon: BadgeCheck},
    // ];

    // const userInsights = [
    //     {label: "Average User Age", statistic: 2, icon: CalendarPlus2},
    //     {label: "Gender Distribution", statistic: 3, icon: BadgeCheck},
    // ];

    const { activeUser, activeUserId } = useAuth();
    const [overviewInsights, setOverviewInsights] = useState([]);
    const [eventInsights, setEventInsights] = useState([]);
    const [revenueInsights, setRevenueInsights] = useState([]);
    const [ratingsInsights, setRatingsInsights] = useState([]);
    const [userInsights, setUserInsights] = useState([]);

    useEffect( () => {
        if (activeUser.role !== 'admin') {
            alert("You are not authorized to view this page.");
            return;
        }
        async function fetchAdminAnalytics() {
            const response = await fetch(`api/admin/analytics`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': activeUserId,
                },
            });
            const result = await response.json();

            if (!response.ok) {
                alert(result.error);
                return;
            }

            setOverviewInsights([
                {label: "Total Number of Events", statistic: result.overview.totalEvents, icon: CalendarPlus2},
                {label: "Total Event Attendance", statistic: result.overview.totalAttendance, icon: BadgeCheck},
                {label: "Total Registered Users", statistic: result.overview.totalUsers, icon: UserCheck},
                {label: "Total Upcoming Events", statistic: result.overview.totalUpcoming, icon: ClockAlert},
                {label: "Total Past Events", statistic: result.overview.totalPast, icon: CalendarSync},
             ]);

            setEventInsights([
                {label: "Most Popular Event by Attendance", statistic: result.eventInsights.mostPopularByAttendance, icon: CalendarPlus2},
                {label: "Most Popular Event by Rating", statistic: result.eventInsights.mostPopularByReviews, icon: BadgeCheck},
                {label: "Average Ticket Price", statistic: result.eventInsights.averagePrice, icon: BadgeCheck},
                {label: "Average Attendance per Event", statistic: result.eventInsights.averageAttendance, icon: BadgeCheck},
                {label: "Users Who Attended More Than One Event", statistic: result.eventInsights.attendedMoreThanOne, icon: BadgeCheck},
            ]);

            setRevenueInsights([
                {label: "All Time Revenue", statistic: result.revenueInsights.totalRevenue, icon: CalendarPlus2},
                // {label: "Revenue By Quarter", statistic: result.revenueInsights.histogram, icon: BadgeCheck},
            ]);
            
            setRatingsInsights([
                {label: "Average Event Rating", statistic: result.ratingsInsights.averageRating, icon: CalendarPlus2},
                {label: "Total Number of Reviews", statistic: result.ratingsInsights.totalReviews, icon: BadgeCheck},
                // {label: "Rating Distribution", statistic: result.ratingsInsights.ratingDistribution, icon: BadgeCheck},
            ]);

            setUserInsights([
                {label: "Average User Age", statistic: result.userInsights.averageAge, icon: CalendarPlus2},
                // {label: "Gender Distribution", statistic: result.userInsights.genderDistribution, icon: BadgeCheck},
            ]);
        }
        fetchAdminAnalytics();
    }, [])


    return (
        <div className="homepage-layout">
            <AdminSidebar />
            <div className="main-content">
                <TopNav />
                <h1 className="page-title">Analytics Dashboard</h1>
                <h3 className="section-header">Overview</h3>
                <div className="analytics-container">
                    <div className="analytics-main-cards">{overviewInsights.map((item,index) => (
                        <AnalyticsCard 
                        key={index} 
                        label={item.label} 
                        statistic={item.statistic} 
                        icon={item.icon} />
                    ))}
                    </div>

                </div>
                <h3 className="section-header">Events Insights</h3>
                <div className="analytics-main-cards">{eventInsights.map((item,index) => (
                        <AnalyticsCard 
                        key={index} 
                        label={item.label} 
                        statistic={item.statistic} 
                        icon={item.icon} />
                    ))}
                    </div>
                <h3 className="section-header">Revenue Insights</h3>
                <div className="analytics-main-cards">{revenueInsights.map((item,index) => (
                        <AnalyticsCard 
                        key={index} 
                        label={item.label} 
                        statistic={item.statistic} 
                        icon={item.icon} />
                    ))}
                </div>
                <h3 className="section-header">Ratings Insights</h3>
                <div className="analytics-main-cards">{ratingsInsights.map((item,index) => (
                        <AnalyticsCard 
                        key={index} 
                        label={item.label} 
                        statistic={item.statistic} 
                        icon={item.icon} />
                    ))}
                </div>
                <h3 className="section-header">Users Insights</h3>
                <div className="analytics-main-cards">{userInsights.map((item,index) => (
                        <AnalyticsCard 
                        key={index} 
                        label={item.label} 
                        statistic={item.statistic} 
                        icon={item.icon} />
                    ))}
                </div>
                <h3 className="section-header">Visualizations</h3>
            </div>
        </div>
    );
}

export default Analytics;


function AnalyticsCard( {label, statistic, icon: Icon } ) {
    return (
        <div className="main-cards-details">
            <Icon className="details-icon" />
            <h1 className="details-statistic">{statistic}</h1>
            <p className="details-name">{label}</p>
        </div>
    )
}