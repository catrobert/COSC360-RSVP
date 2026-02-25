import Sidebar from "../components/sidebar";

const username = "Lexi Loudiadis"

function Homepage() {
    return (
        <div>
            <Sidebar user= { username } />
        </div>
    );
}

export default Homepage;