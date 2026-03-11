import AdminSidebar from "../../components/AdminSidebar";
import AdminManagement from "./AdminManagement"
import topNav from "../../components/topNav";
import './adminManagement.css';

function AdminUserManage(){
    return(
        <div style={{display:'flex', maxheight:'100vh'}}>
            <AdminSidebar />
            <AdminManagement />
        </div>
    )
}

export default AdminUserManage;