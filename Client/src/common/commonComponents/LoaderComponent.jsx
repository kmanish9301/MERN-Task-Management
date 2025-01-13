import React from 'react';
import { Spin } from 'antd';
// import 'antd/dist/antd.css';

const LoaderComponent = () => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
            }}
        >
            <Spin size="large" />
        </div>
    );
};

export default LoaderComponent;
