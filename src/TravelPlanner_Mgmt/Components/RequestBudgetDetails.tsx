import React,{useState, useContext, useEffect} from 'react';
import { TravelPlannerContext } from '../Context/TravelPlannerContext';
import { TravelPlannerActionType } from '../Actions/TravelPlannerReducer';
import Loader from '../../Common/Loader';
import { useParams } from 'react-router-dom';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type BudgetResponse = {
  amount: number;
  currency?: string;
};

const RequestBudgetDetails =()=> {

  const {id} = useParams<{id: string}>();
  const{state} = useContext(TravelPlannerContext);
  const navigate = useNavigate();

  const[loader, setLoader] = useState(true);

  const[amount, setAmount] = useState<number | null>(null);
  const[currency, setCurrency] = useState<string>('INR');
  const [errorText, setErrorText] = useState<string>('')

  useEffect(()=>{
    const fetchApprovedBudget = async() =>{
      if (!id) {
        setErrorText('Missing request id.');
        setLoader(false);
      return;
      }
      setLoader(true);
     
      try{
        const response = await fetch(`http://localhost:5000/api/TP_Services/travelrequests/calculatebudget?travelRequestId=${id}`,{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({}),
        });
        
        if(!response.ok){
          const text = await response.text().catch(() => '');
            throw new Error(`Budget POST failed: ${response.status} ${response.statusText} - ${text}`);
        }

        const data: BudgetResponse = await response.json();
        const num = Number(data);
        if(Number.isNaN(num)){
          console.error('Unexpected non-numeric budget response:', data);
          throw new Error('Budget response is not a numeric value.');

        }
        setAmount(num);
        setCurrency(data.currency || 'INR');
      }catch(error: any){
      console.error("Error fetching budget details:", error);
      setErrorText('Failed to fetch budget details.');
      }finally{
      setLoader(false);
    }   
  }
  fetchApprovedBudget();
  },[id]);

  if (loader) return <Loader />;
  return (
    <>
    <Paper elevation={3} sx={{ p: 3, maxWidth: 720, m: '24px auto' }}>
      <Typography variant="h6" gutterBottom>
        Budget Details for Request ID {id}
      </Typography>

      {errorText ? (
        <Typography color="error" variant="body2">{errorText}</Typography>
      ) : amount != null ? (
          <Typography variant="body1" >
            Applicable Budget: {currency || '₹'} {amount.toLocaleString() ?? 'N/A'}
          </Typography>
      ): (
        <Typography variant="body2">No budget details available.</Typography>
      )}
    </Paper>
    <Button onClick={()=>navigate('/')}>HOME</Button>
  </>
  )
}

export default RequestBudgetDetails;