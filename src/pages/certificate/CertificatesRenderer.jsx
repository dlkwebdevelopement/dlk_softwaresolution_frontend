import React, { useRef, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Modal, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import toast from 'react-hot-toast';
import { PostRequest } from '../../api/api';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  AcceptanceLetterTemplate, 
  CompletionLetterTemplate, 
  AttendanceCertificateTemplate, 
  ProjectCompletionLetterTemplate 
} from './CertificateTemplates';

const CertificatesRenderer = ({ data }) => {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(null);
  const [loading, setLoading] = useState({});

  const certificates = [
    { id: 'acceptance', title: 'Internship Acceptance Letter', Component: AcceptanceLetterTemplate },
    { id: 'completion', title: 'Internship Completion Letter', Component: CompletionLetterTemplate },
    { id: 'attendance', title: 'Attendance Certificate', Component: AttendanceCertificateTemplate },
    { id: 'project', title: 'Project Completion Letter', Component: ProjectCompletionLetterTemplate },
  ];

  const handlePreview = (cert) => {
    setCurrentPreview(cert);
    setPreviewModalOpen(true);
  };

  const handlePreviewDownload = async () => {
    const toastId = toast.loading('Generating PDF...');
    try {
      const element = document.getElementById('preview-cert-render');
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.studentName.replace(/\s+/g, '_')}_${currentPreview.title.replace(/\s+/g, '_')}.pdf`);
      toast.success('Downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to download.', { id: toastId });
    }
  };

  const handlePreviewPrint = async () => {
    const toastId = toast.loading('Preparing Print...');
    try {
      const element = document.getElementById('preview-cert-render');
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
      iframe.contentWindow.document.write(`
        <html>
          <head>
            <title>Print Certificate</title>
            <style>
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: flex-start; }
              img { width: 100%; height: auto; max-width: 210mm; }
              @media print {
                @page { margin: 0; size: A4 portrait; }
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" onload="window.print();" />
          </body>
        </html>
      `);
      iframe.contentWindow.document.close();
      setTimeout(() => {
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
      }, 10000);
      toast.success('Print ready!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to print.', { id: toastId });
    }
  };

  const handlePreviewEmail = async () => {
    if (!data.studentEmail) {
      toast.error('Student email is missing from the form!');
      return;
    }
    const toastId = toast.loading('Sending Email...');
    try {
      const element = document.getElementById('preview-cert-render');
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const pdfBase64 = pdf.output('datauristring');
      await PostRequest('/certificates/send-email', {
        email: data.studentEmail,
        pdfBase64,
        title: currentPreview.title,
        studentName: data.studentName
      });
      toast.success('Email sent successfully!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to send email.', { id: toastId });
    }
  };

  const handleDownload = async (certId, title) => {
    setLoading(prev => ({ ...prev, [certId]: true }));
    try {
      const element = document.getElementById(`cert-render-${certId}`);
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.studentName.replace(/\s+/g, '_')}_${title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(prev => ({ ...prev, [certId]: false }));
    }
  };

  const handlePrint = async (certId) => {
    setLoading(prev => ({ ...prev, [`print-${certId}`]: true }));
    try {
      const element = document.getElementById(`cert-render-${certId}`);
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
      
      iframe.contentWindow.document.write(`
        <html>
          <head>
            <title>Print Certificate</title>
            <style>
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: flex-start; }
              img { width: 100%; height: auto; max-width: 210mm; }
              @media print {
                @page { margin: 0; size: A4 portrait; }
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" onload="window.print();" />
          </body>
        </html>
      `);
      iframe.contentWindow.document.close();
      
      // Cleanup iframe after printing
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 10000);
      
    } catch (error) {
      console.error('Error printing:', error);
    } finally {
      setLoading(prev => ({ ...prev, [`print-${certId}`]: false }));
    }
  };

  const handleSendEmail = async (certId, title) => {
    if (!data.studentEmail) {
      toast.error('Student email is missing from the form!');
      return;
    }
    setLoading(prev => ({ ...prev, [`email-${certId}`]: true }));
    try {
      const element = document.getElementById(`cert-render-${certId}`);
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const pdfBase64 = pdf.output('datauristring');
      
      await PostRequest('/certificates/send-email', {
        email: data.studentEmail,
        pdfBase64,
        title,
        studentName: data.studentName
      });
      toast.success('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email. Please check server logs.');
    } finally {
      setLoading(prev => ({ ...prev, [`email-${certId}`]: false }));
    }
  };

  return (
    <Box>
      <Typography variant="h4" color="primary.main" textAlign="center" gutterBottom>
        Generated Certificates
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" textAlign="center" mb={4}>
        Please review, download, or print your certificates below.
      </Typography>

      <Grid container spacing={4}>
        {certificates.map((cert) => (
          <Grid item xs={12} sm={6} key={cert.id}>
            <Card elevation={3} sx={{ borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 20px rgba(61, 184, 43, 0.2)' } }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {cert.title}
                </Typography>
                
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2, px: 2 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<VisibilityIcon />} 
                    onClick={() => handlePreview(cert)}
                    sx={{ borderRadius: 2 }}
                  >
                    View Full Certificate
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={loading[cert.id] ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />} 
                    onClick={() => handleDownload(cert.id, cert.title)}
                    disabled={loading[cert.id]}
                    sx={{ borderRadius: 2 }}
                  >
                    Download PDF
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    startIcon={loading[`email-${cert.id}`] ? <CircularProgress size={20} color="inherit" /> : <EmailIcon />} 
                    onClick={() => handleSendEmail(cert.id, cert.title)}
                    disabled={loading[`email-${cert.id}`]}
                    sx={{ borderRadius: 2 }}
                  >
                    Send to Mail
                  </Button>
                  <Button  
                    variant="text" 
                    startIcon={loading[`print-${cert.id}`] ? <CircularProgress size={20} color="inherit" /> : <PrintIcon />} 
                    onClick={() => handlePrint(cert.id)}
                    disabled={loading[`print-${cert.id}`]}
                    color="secondary"
                    sx={{ color: 'text.secondary' }}
                  >
                    Print
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Hidden Render Containers for html2canvas */}
      <Box sx={{ position: 'absolute', top: '-10000px', left: '-10000px', opacity: 0, zIndex: -1 }}>
        {certificates.map((cert) => (
          <Box key={cert.id} id={`cert-render-${cert.id}`}>
            <cert.Component data={data} />
          </Box>
        ))}
      </Box>

      {/* Preview Modal */}
      <Modal
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
      >
        <Box sx={{ 
          backgroundColor: '#333', 
          width: '100%', 
          maxWidth: '850px', 
          maxHeight: '90vh',
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: 24
        }}>
          <Box sx={{ p: 2, backgroundColor: '#222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="#fff">
              {currentPreview?.title} <span style={{fontSize: '12px', color: '#aaa'}}>(Click text to edit)</span>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" color="primary" size="small" onClick={handlePreviewDownload}>Download Edits</Button>
                <Button variant="contained" color="secondary" size="small" onClick={handlePreviewPrint}>Print Edits</Button>
                <Button variant="contained" color="info" size="small" onClick={handlePreviewEmail}>Email Edits</Button>
                <IconButton onClick={() => setPreviewModalOpen(false)} sx={{ color: '#fff', ml: 1 }}>
                  <CloseIcon />
                </IconButton>
            </Box>
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto', p: 3, display: 'flex', justifyContent: 'center', backgroundColor: '#555' }}>
            {currentPreview && (
              <Box sx={{ 
                transform: { xs: 'scale(0.4)', sm: 'scale(0.6)', md: 'scale(0.8)', lg: 'scale(1)' },
                transformOrigin: 'top center',
                pb: '100%' // give some scroll room
              }}>
                <Box id="preview-cert-render">
                  <currentPreview.Component data={data} />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CertificatesRenderer;
