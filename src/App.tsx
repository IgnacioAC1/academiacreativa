import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import CoursePage from "./pages/CoursePage.tsx";
import Courses from "./pages/Courses.tsx";
import EventPage from "./pages/EventPage.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import StudentDashboard from "./pages/StudentDashboard.tsx";
import CourseViewer from "./pages/CourseViewer.tsx";
import CoursesAdminList from "./pages/CoursesAdminList.tsx";
import CourseEditor from "./pages/CourseEditor.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CoursePage />} />
            <Route path="/event/:id" element={<EventPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/learn/:id" element={<CourseViewer />} />
            <Route path="/admin" element={<CoursesAdminList scope="admin" />} />
            <Route path="/admin/course/:id" element={<CourseEditor scope="admin" />} />
            <Route path="/instructor" element={<CoursesAdminList scope="instructor" />} />
            <Route path="/instructor/course/:id" element={<CourseEditor scope="instructor" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
