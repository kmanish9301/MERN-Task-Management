import React, { useEffect } from 'react';
import { notification } from 'antd';

const ToastNotification = ({ message, severity }) => {
    useEffect(() => {
        if (message) {
            notification[severity]({
                message: severity.charAt(0).toUpperCase() + severity.slice(1),
                description: message,
                placement: 'topRight',
                duration: 3,
            });
        }
    }, [message, severity]);

    return null;
};

export default ToastNotification;
