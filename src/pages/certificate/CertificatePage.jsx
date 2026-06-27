import React, { useState } from 'react';
import { Box, Container, Typography, Grid, TextField, Button, Paper, Alert, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import CertificatesRenderer from './CertificatesRenderer';

const CertificatePage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [certificateData, setCertificateData] = useState(null);

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const calculateDuration = (start, end) => {
    if (!start || !end) return '';
    const s = dayjs(start);
    const e = dayjs(end);
    const months = e.diff(s, 'month');
    const days = e.diff(s, 'day');
    
    if (months > 0) {
        return `${months} Month${months > 1 ? 's' : ''}`;
    }
    return `${days} Day${days > 1 ? 's' : ''}`;
  };

  const onSubmit = (data) => {
    const duration = calculateDuration(data.startDate, data.endDate);
    setCertificateData({ ...data, duration });
  };

  return (
    <Box sx={{ py: 6, minHeight: '100vh', backgroundColor: '#f9fbf9' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" color="primary.main" gutterBottom>
            Internship Certificate Generator
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Fill in the student details below to generate internship documents instantly.
          </Typography>
        </Box>

        {!certificateData ? (
          <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, backgroundColor: '#fff' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={2}>
                  <TextField 
                    select
                    fullWidth label="Title *" 
                    defaultValue="Mr."
                    {...register('salutation', { required: 'Title is required' })}
                    error={!!errors.salutation} helperText={errors.salutation?.message}
                  >
                    <MenuItem value="Mr.">Mr.</MenuItem>
                    <MenuItem value="Ms.">Ms.</MenuItem>
                    <MenuItem value="Mrs.">Mrs.</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth label="Student Name *" 
                    {...register('studentName', { required: 'Student Name is required' })} 
                    error={!!errors.studentName} helperText={errors.studentName?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth label="College Registration Number *" 
                    {...register('regNumber', { required: 'Registration Number is required' })}
                    error={!!errors.regNumber} helperText={errors.regNumber?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth label="College Name *" 
                    {...register('collegeName', { required: 'College Name is required' })}
                    error={!!errors.collegeName} helperText={errors.collegeName?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth label="Student Email *" type="email"
                    {...register('studentEmail', { required: 'Student Email is required' })}
                    error={!!errors.studentEmail} helperText={errors.studentEmail?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth label="Degree (e.g. B.Tech) *" 
                    {...register('degree', { required: 'Degree is required' })}
                    error={!!errors.degree} helperText={errors.degree?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth label="Department *" 
                    {...register('department', { required: 'Department is required' })}
                    error={!!errors.department} helperText={errors.department?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth label="Internship Start Date *" type="date" InputLabelProps={{ shrink: true }}
                    {...register('startDate', { required: 'Start Date is required' })}
                    error={!!errors.startDate} helperText={errors.startDate?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth label="Internship End Date *" type="date" InputLabelProps={{ shrink: true }}
                    {...register('endDate', { required: 'End Date is required' })}
                    error={!!errors.endDate} helperText={errors.endDate?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth label="Internship Domain *" placeholder="e.g. Web Development"
                    {...register('domain', { required: 'Domain is required' })}
                    error={!!errors.domain} helperText={errors.domain?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField 
                    fullWidth label="Project Title (Optional)" placeholder="e.g. BharathVoice"
                    {...register('projectTitle')}
                  />
                </Grid>
                


                <Grid item xs={12} mt={2} textAlign="center">
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    sx={{ px: 5, py: 1.5, fontSize: '1.1rem', borderRadius: 2, boxShadow: '0 4px 14px 0 rgba(61, 184, 43, 0.39)' }}
                  >
                    Generate Certificates
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        ) : (
          <Box>
             <Box mb={4} textAlign="center">
               <Button variant="outlined" onClick={() => setCertificateData(null)} sx={{ mr: 2, borderRadius: 2 }}>Edit Details</Button>
             </Box>
             <CertificatesRenderer data={certificateData} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CertificatePage;
