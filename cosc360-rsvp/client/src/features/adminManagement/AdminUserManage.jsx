import AdminSidebar from "../../client/components/AdminSidebar";
import AdminManagement from "../../client/components/AdminManagement"
import topNav from "../../client/components/topNav";
import '../css/adminManagement.css';

function AdminUserManage(){
    return(
        <div style={{display:'flex', maxheight:'100vh'}}>
            <AdminSidebar />
            <AdminManagement />
        </div>
    )
}

export default AdminUserManage;