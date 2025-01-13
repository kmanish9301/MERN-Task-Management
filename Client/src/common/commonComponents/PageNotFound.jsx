import { Typography } from "antd";
import { useNavigate } from 'react-router-dom';
import PageNotFoundImg from '../../assets/404.png';
// import { isAuthenticated } from './utils';

const PageNotFound = () => {
    const navigate = useNavigate();
    const handleGoToHome = () => {
        navigate('/');
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', background: 'linear-gradient(to right, #ece9e6, #ffffff)', height: '100vh' }}>
            <img src={PageNotFoundImg} />
            <Typography level={5} color="#616161 !important" mb={1}>Ooops, page not found...!</Typography>
            <Typography level={5} color="initial">Something went wrong.</Typography>

            {/* {isAuthenticated() && (
                <Button variant="outlined" color="primary" sx={{ marginTop: '1rem', borderRadius: '1.5rem' }} onClick={handleGoToHome}>
                    Back to Home
                </Button>
            )} */}
        </div>
    )
}

export default PageNotFound;