import React, { useState, useContext, useEffect } from 'react';
import { TextField,Typography, Grid,Button, FormControl, InputLabel,Select,MenuItem } from '@material-ui/core'
import { ExpenseTrackerContext } from '../../../context/context';
import { v4 as uuidv4 } from 'uuid';

import formatDate from '../../../utils/formatDate';
import useStyles from './styles';
import CustomizedSnackbar from '../../../components/Snackbar/Snackbar';
import {incomeCategories,expenseCategories} from '../../../constants/categories'
import { useSpeechContext } from '@speechly/react-client';

const initialState={
    category:'',
    amount:'',
    type:'Income',
    date:formatDate(new Date()),
}

const Form = () => {
    const classes = useStyles();
    const [formData, setFormData] = useState(initialState);
    const {addTransaction} = useContext(ExpenseTrackerContext);
    const { segment } = useSpeechContext();
    const [open,setOpen] = useState(initialState);
    
    const createTransaction = () => {
        if (Number.isNaN(Number(formData.amount)) || !formData.date.includes('-')) return;
    
        if (incomeCategories.map((iC) => iC.type).includes(formData.category)) {
          setFormData({ ...formData, type: 'Income' });
        } else if (expenseCategories.map((iC) => iC.type).includes(formData.category)) {
          setFormData({ ...formData, type: 'Expense' });
        }
    
        setOpen(true);
        addTransaction({ ...formData, amount: Number(formData.amount), id: uuidv4() });
        setFormData(initialState);
      };
    
    useEffect(() => {
        if (segment) {
          if (segment.intent.intent === 'add_expense') {
            setFormData({ ...formData, type: 'Expense' });
          } else if (segment.intent.intent === 'add_income') {
            setFormData({ ...formData, type: 'Income' });
          } else if (segment.isFinal && segment.intent.intent === 'create_transaction') {
            return createTransaction();
          } else if (segment.isFinal && segment.intent.intent === 'cancel_transaction') {
            return setFormData(initialState);
          }
    
          segment.entities.forEach((s) => {
            const category = `${s.value.charAt(0)}${s.value.slice(1).toLowerCase()}`;
    
            switch (s.type) {
              case 'amount':
                setFormData({ ...formData, amount: s.value });
                break;
              case 'category':
                if (incomeCategories.map((iC) => iC.type).includes(category)) {
                  setFormData({ ...formData, type: 'Income', category });
                } else if (expenseCategories.map((iC) => iC.type).includes(category)) {
                  setFormData({ ...formData, type: 'Expense', category });
                }
                break;
              case 'date':
                setFormData({ ...formData, date: s.value });
                break;
              default:
                break;
            }
          });
    
          if (segment.isFinal && formData.amount && formData.category && formData.type && formData.date) {
            createTransaction();
          }
        }
      }, [segment]);

    const selectedCategories = formData.type === 'Income' ? incomeCategories: expenseCategories;
    
  return (
    <Grid>
        <CustomizedSnackbar open={open} setOpen={setOpen}/>
        <Grid item xs={12}>
            <Typography variant="subtitle2" align="center" gutterBottom>...</Typography>
        </Grid>
        <Grid item xs={6}>
            <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select value={formData.type} onChange={(e)=>setFormData({...formData,type:e.target.value})}>
                    <MenuItem value="Income">Income</MenuItem>
                    <MenuItem value="Expense">Expense</MenuItem>
                </Select>
            </FormControl>
        </Grid> 
        <Grid item xs={6}>
            <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={formData.category} onChange={(e)=>setFormData({...formData,category:e.target.value})}>
                    {selectedCategories.map((c)=><MenuItem key={c.type} value={c.type}>{c.type}</MenuItem>)}
                </Select>
            </FormControl>
        </Grid> 
        <Grid item xs={6}>
            <TextField fullWidth label="Amount" type="number" value={formData.amount} onChange={(e)=>setFormData({...formData,amount:e.target.value})}/> 
        </Grid>
        <Grid item xs={6}>
            <TextField fullWidth label="Date" type="date" value={formData.date} onChange={(e)=>setFormData({...formData,date:e.target.value})}/> 
        </Grid>
        <Button className={classes.Button} variant='outlined' color='primary' fullWidth onClick={createTransaction}>Create</Button>
    </Grid>
  )
}

export default Form