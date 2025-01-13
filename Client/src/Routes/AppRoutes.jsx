import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import LoaderComponent from "../common/commonComponents/LoaderComponent"
import Login from '../common/Authentication/Login';
import PageNotFound from '../common/commonComponents/PageNotFound';

const AppRoutes = () => {
    const Dashboard = lazy(() => import('../Main/Dashboard'));
    const About = lazy(() => import('../Main/About'));
    const Tasks = lazy(() => import('../Main/Tasks'));

    return (
        <Suspense fallback={<LoaderComponent />}>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Navigate to="/login" replace />
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />


                <Route path="/tasks" element={<Tasks />} />

                <Route path="/about" element={<About />} />

                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Suspense>
    )
}

export default AppRoutes