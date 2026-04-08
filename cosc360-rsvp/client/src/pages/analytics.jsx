import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TopNav from "../components/topNav";
import "../css/Home.css";
import "../css/adminAnalytics.css"
import { CalendarPlus2, BadgeCheck, UserCheck, ClockAlert, CalendarSync } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function Analytics() {
    const { activeUser, activeUserId } = useAuth();
    const [overviewInsights, setOverviewInsights] = useState([]);
    const [eventInsights, setEventInsights] = useState([]);
    const [revenueInsights, setRevenueInsights] = useState([]);
    const [ratingsInsights, setRatingsInsights] = useState([]);
    const [userInsights, setUserInsights] = useState([]);
    const [revenueEventData, setRevenueEventData] = useState([]);
    const [ratingDistributionData, setRatingDistributionData] = useState([]);
    const [genderDistributionData, setGenderDistributionData] = useState([]);

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
                {label: "Average Ticket Price", statistic: result.eventInsights.averagePrice, icon: BadgeCheck, isCurrency: true},
                {label: "Average Attendance per Event", statistic: result.eventInsights.averageAttendance, icon: BadgeCheck},
                {label: "Users Who Attended More Than One Event", statistic: result.eventInsights.attendedMoreThanOne, icon: BadgeCheck},
            ]);

            setRevenueInsights([
                {label: "All Time Revenue", statistic: result.revenueInsights.totalRevenue, icon: CalendarPlus2, isCurrency: true},
            ]);

            setRevenueEventData(result.revenueInsights.histogram);
            
            setRatingsInsights([
                {label: "Average Event Rating", statistic: result.ratingsInsights.averageRating, icon: CalendarPlus2},
                {label: "Total Number of Reviews", statistic: result.ratingsInsights.totalReviews, icon: BadgeCheck},
            ]);

            setRatingDistributionData(result.ratingsInsights.ratingDistribution);

            setUserInsights([
                {label: "Average User Age", statistic: result.userInsights.averageAge, icon: CalendarPlus2},
            ]);

            setGenderDistributionData(result.userInsights.genderDistribution);
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
                        icon={item.icon}
                        isCurrency={item.isCurrency} />
                    ))}
                    </div>
                <h3 className="section-header">Revenue Insights</h3>
                <div className="analytics-main-cards">{revenueInsights.map((item,index) => (
                        <AnalyticsCard 
                        key={index} 
                        label={item.label} 
                        statistic={item.statistic} 
                        icon={item.icon}
                        isCurrency={item.isCurrency} />
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
                <h4 className="section-header">Revenue by Quarter</h4>
                <BarChart width={600} height={300} data={revenueEventData}>
                    <CartesianGrid />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Bar dataKey="revenue" fill="#97b0cb" name="Revenue" />
                </BarChart>

                <h4 className="section-header">Events by Quarter</h4>
                <BarChart width={600} height={300} data={revenueEventData}>
                    <CartesianGrid />
                    <XAxis dataKey="quarter" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#bedfff" name="Events" />
                </BarChart>

                <h4 className="section-header">Event Rating Distribution</h4>
                <BarChart width={600} height={300} data={ratingDistributionData}>
                    <CartesianGrid />
                    <XAxis dataKey="rating" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#92c7fb" name="Count" />
                </BarChart>

                <h4 className="section-header">User Gender Distribution</h4>
                <BarChart width={600} height={300} data={genderDistributionData}>
                    <CartesianGrid />
                    <XAxis dataKey="gender" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#78a6d5" name="Count" />
                </BarChart>
            </div>
        </div>
    );
}

export default Analytics;


function AnalyticsCard( {label, statistic, icon: Icon, isCurrency } ) {
    return (
        <div className="main-cards-details">
            <Icon className="details-icon" />
            {typeof statistic === 'string' ? (<h1 className="details-statistic-word">{statistic}</h1>) 
            : isCurrency ? (<h1 className="details-statistic">${statistic}</h1>) : (<h1 className="details-statistic">{statistic}</h1>)}
            <p className="details-name">{label}</p>
        </div>
    )
}