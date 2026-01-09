import React from 'react'
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import  Header  from '../Layout/Header';

const HomePage = () => {
    const navigate = useNavigate();
  return (
    <Box display="flex" justifyContent="center"  gap={2} mt={16}>
      <Button variant="contained" color="primary" onClick={() => navigate('/add-employee')}>
        Add User
      </Button>
      <Button variant="outlined" color="secondary" onClick={() => navigate('/employee-detail')}>
        User List
      </Button>
      <Button variant="outlined" color="secondary" onClick={() => navigate('/new-travel-request')}>
        New Request
      </Button>
      <Button variant="outlined" color="secondary" onClick={() => navigate('/pending-travel-request')}>
        Pending Request
      </Button>
    </Box>

  )
}
export default HomePage;
