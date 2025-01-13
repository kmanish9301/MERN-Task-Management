import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getAllUsersAction, getAllUsersSuccess, getAllUsersError } from '../Store/Slices/UserSlice';
import ToastNotification from '../common/commonComponents/ToastNotification';
import LoaderComponent from '../common/commonComponents/LoaderComponent';
import { toasterFlags } from '../common/commonComponents/Helper';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { data, loading, error, success } = useSelector((state) => state.users);

    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            dispatch(getAllUsersAction());
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/v1/get_users`
                );
                dispatch(getAllUsersSuccess(response.data));

                // Set success toast
                setToastMessage("Users fetched successfully!");
                setToastSeverity(toasterFlags.SUCCESS);
            } catch (error) {
                dispatch(getAllUsersError(error.message));

                // Set error toast
                setToastMessage(error.message);
                setToastSeverity(toasterFlags.ERROR);
            }
        };

        fetchUsers();
    }, [dispatch]);

    return (
        <>
            <h1>Dashboard</h1>
            {loading && <LoaderComponent />}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {success && (
                <ul>
                    {data.results.map((user) => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            )}

            {toastMessage && (
                <ToastNotification message={toastMessage} severity={toastSeverity} />
            )}
        </>
    );
};

export default Dashboard;
