import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { CssBaseline,ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserProfile from "./pages/user/UserProfile";
import UnAuthorized from './pages/UnAuthorized';
import UserDashboard from './pages/user/UserDashboard';
import UserRoute from './routes/UserRoute';
import { ProSidebarProvider } from 'react-pro-sidebar';
import Layout from './pages/global/Layout';
import UserJobHistory from './pages/user/UserJobHistory';
import AdminRoute from './routes/AdminRoute';
import AdminStatus from './pages/admin/AdminStatus';
import AdminDashboard from './pages/admin/AdminDashboard';
import SingleJob from './pages/SingleJob';
import UserJobApply from './pages/user/UserJobApply';
import AdmUsers from './pages/admin/AdmUsers';
import AdmJobs from './pages/admin/AdmJobs';
import AdmCreateJobs from './pages/admin/AdmCreateJobs';
import AdmEditJobs from './pages/admin/AdmEditJobs';
import AdmCategory from './pages/admin/AdmCategory';
import AdmCreateCategory from './pages/admin/AdmCreateCategory';
import DashLayout from './pages/global/DashLayout';
import AppliedLayout from './pages/global/AppliedLayout';
import JobsLayOut from './pages/global/JobsLayOut';
import CatLayout from './pages/global/CatLayout';
import ApplyLayout from './pages/global/ApplyLayout';


const UserDashboardMain = DashLayout(UserDashboard);
const UserJobHistoryMain = AppliedLayout(UserJobHistory);
const UserProfileMain = AppliedLayout(UserProfile);
const UserApplyJobMain = ApplyLayout(UserJobApply);
const AdminStatusMain = AppliedLayout(AdminStatus);
const AdminDashboardMain = DashLayout(AdminDashboard);
const AdmUsersMain = Layout(AdmUsers);
const AdmJobsMain = JobsLayOut(AdmJobs);
const AdmCreateJobsMain = JobsLayOut(AdmCreateJobs)
const AdmEditJobsMain = JobsLayOut(AdmEditJobs)
const AdmCategoryMain = CatLayout(AdmCategory)
const AdmCreateCategoryMain = CatLayout(AdmCreateCategory)
const App=()=>{
  return(
    <>
    <ToastContainer />
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProSidebarProvider>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/search/location/:location' element={<Home />} />
      <Route path='/search/loc/:location' element={<UserApplyJobMain />} />
      <Route path='/search/:keyword' element={<UserApplyJobMain />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/job/:id" element={<UserRoute><SingleJob/></UserRoute>} />
      <Route path="/admin/status" element={<AdminRoute ><AdminStatusMain /> </AdminRoute>} />
      <Route path="/admin/dashboard" element={<AdminRoute ><AdminDashboardMain /> </AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute ><AdmUsersMain /> </AdminRoute>} />
      <Route path="/admin/jobs" element={<AdminRoute ><AdmJobsMain /> </AdminRoute>} />
      <Route path='/admin/job/create' element={<AdminRoute><AdmCreateJobsMain/></AdminRoute>} />
      <Route path='/admin/edit/job/:id' element={<AdminRoute><AdmEditJobsMain/></AdminRoute>} />
      <Route path='/admin/edit/category/:id' element={<AdminRoute><AdmEditJobsMain/></AdminRoute>} />
      <Route path='/admin/category' element={<AdminRoute><AdmCategoryMain /></AdminRoute>} />
      <Route path='/admin/category/create' element={<AdminRoute><AdmCreateCategoryMain /></AdminRoute>} />
      <Route path="/user/dashboard" element={<UserRoute> <UserDashboardMain/> </UserRoute>} />
      <Route path="/user/apply/jobs" element={<UserRoute> <UserApplyJobMain/> </UserRoute>} />
      <Route path="/user/jobs" element={<UserRoute> <UserJobHistoryMain/> </UserRoute>} />
      <Route path="/userProfile" element={ <UserRoute> <UserProfileMain /> </UserRoute> } />
      <Route path='/unauthorized' element={<UnAuthorized />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
    </BrowserRouter>
    </ProSidebarProvider>
    </ThemeProvider>
    </>
  )
}

export default App;

