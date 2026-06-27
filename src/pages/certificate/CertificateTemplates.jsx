import React from 'react';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

const A4_WIDTH = '794px';
const A4_HEIGHT = '1123px';

const FormatDate = ({ date }) => {
  const d = dayjs(date);
  const day = d.date();
  const ordinal = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
  return (
    <Box component="span" sx={{ display: 'inline', fontFamily: 'inherit' }}>
      {day}<sup>{ordinal}</sup> {d.format('MMMM YYYY')}
    </Box>
  );
};

export const CertificateLayout = ({ children, title, date }) => {
  return (
    <Box
      sx={{
        width: A4_WIDTH,
        height: A4_HEIGHT,
        backgroundColor: 'transparent',
        position: 'relative',
        boxSizing: 'border-box',
        color: '#1a2b1b',
        fontFamily: '"Times New Roman", Times, serif',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <img 
        src="/photos/letterhead.jpg" 
        alt="Letterhead Background" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          objectFit: 'cover'
        }} 
      />
      
      <Box sx={{ position: 'relative', zIndex: 1, padding: '280px 80px 320px 80px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      {/* Date */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Typography variant="body1" sx={{ fontFamily: 'inherit', fontWeight: 'bold' }}>
          Date: {dayjs(date).format('DD MMM YYYY')}
        </Typography>
      </Box>

      {/* Title */}
      {title && (
        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 5, mt: 1, fontFamily: 'inherit', textTransform: 'uppercase' }}>
          {title}
        </Typography>
      )}

      {/* Content */}
      <Box sx={{ fontSize: '18px', lineHeight: 1.3 }}>
        {children}
      </Box>

      {/* Footer / Signatures */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between',mt:1, pt: 4 }}>
        <Box textAlign="center">
          <Box sx={{ width: '150px', height: '60px', mb: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#999', fontFamily: 'inherit' }}>(Seal)</Typography>
          </Box>
          <Typography sx={{ borderTop: '1px solid #333', pt: 1, fontWeight: 'bold', fontFamily: 'inherit' }}>
            Company Seal
          </Typography>
        </Box>
        <Box textAlign="center">
          <Box sx={{ width: '200px', height: '60px', mb: 1 }}></Box>
          <Typography sx={{ borderTop: '1px solid #333', pt: 1, fontWeight: 'bold', fontFamily: 'inherit' }}>
            Authorized Signatory
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'inherit' }}>
            Human Resources
          </Typography>
        </Box>
      </Box>
      </Box>
    </Box>
  );
};

export const AcceptanceLetterTemplate = ({ data }) => {
  return (
    <CertificateLayout title={null} date={dayjs().format('YYYY-MM-DD')}>
      <Typography sx={{ fontFamily: 'inherit', mb: 1, textAlign: 'justify', lineHeight: 1.5 }}>
        To
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', mb: 0, textAlign: 'justify', lineHeight: 1.5 }}>
        Head of the Department,
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', mb: 0, textAlign: 'justify', lineHeight: 1.5 }}>
        Department of {data.department},
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', mb: 3, textAlign: 'justify', lineHeight: 1.5 }}>
        {data.collegeName}.
      </Typography>

      <Typography sx={{ fontFamily: 'inherit', mb: 3, fontWeight: 'bold', textDecoration: 'underline', textAlign: 'left' }}>
        Sub: Letter of Internship Acceptance
      </Typography>

      <Typography sx={{ fontFamily: 'inherit', mb: 3, textAlign: 'justify' }}>
        This is to certify that <strong>{data.salutation} {data.studentName}</strong> with register number - <strong>{data.regNumber}</strong>, pursuing <strong>{data.degree} ({data.department})</strong> at <strong>{data.collegeName}</strong> have been accepted for an internship at <strong>DLK Software Solutions</strong>.
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', mb: 3, textAlign: 'justify' }}>
        The internship will be conducted from <strong><FormatDate date={data.startDate} /> to <FormatDate date={data.endDate} /></strong> under the domain “<strong>{data.domain}</strong>.”
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', mb: 3, textAlign: 'justify' }}>
        All information and data obtained during the internship must be treated as strictly confidential.
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', mb: 3, textAlign: 'justify' }}>
        We appreciate your interest in <strong>DLK Software Solutions</strong> and look forward to a successful engagement.
      </Typography>
    </CertificateLayout>
  );
};

export const CompletionLetterTemplate = ({ data }) => {
  const pronoun = data.salutation === 'Mr.' ? 'he' : 'she';
  return (
    <CertificateLayout title="TO WHOMSOEVER CONCERN" date={dayjs(data.endDate).format('YYYY-MM-DD')}>
      <Typography sx={{ fontFamily: 'inherit', mb: 3, textAlign: 'justify' }}>
        This is to certify that <strong>{data.salutation} {data.studentName}</strong> with the Reg. No: <strong>{data.regNumber}</strong>, pursuing <strong>{data.degree} ({data.department})</strong> at <strong>{data.collegeName}</strong> has successfully completed the Internship work in the domain of <strong>{data.domain}</strong>.
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', mb: 3, textAlign: 'justify' }}>
        The Internship work was undertaken from <strong><FormatDate date={data.startDate} /> to <FormatDate date={data.endDate} /></strong>. During this period, {pronoun} satisfactorily performed all the assigned tasks.
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', mb: 3, textAlign: 'justify' }}>
        All data and information collected or accessed during the project period shall be treated as confidential.
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', mb: 3, textAlign: 'justify' }}>
        We Appreciate your Interest in <strong>DLK Software Solutions</strong>
      </Typography>
    </CertificateLayout>
  );
};

export const AttendanceCertificateTemplate = ({ data }) => {
  const objPronoun = data.salutation === 'Mr.' ? 'him' : 'her';
  return (
    <CertificateLayout title="INTERNSHIP ATTENDANCE CERTIFICATE" date={dayjs(data.endDate).format('YYYY-MM-DD')}>
      <Typography sx={{ fontFamily: 'inherit', mb: 3, textAlign: 'justify' }}>
        This is to certify that <strong>{data.salutation} {data.studentName}</strong>, pursuing <strong>{data.department}</strong> from <strong>{data.collegeName}</strong> has attended the Internship Training Program at <strong>DLK Software solutions</strong> from <strong><FormatDate date={data.startDate} /> to <FormatDate date={data.endDate} /></strong>.
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', mb: 3, textAlign: 'justify' }}>
        The student actively participated in the internship sessions and maintained attendance during the internship period.
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography sx={{ fontFamily: 'inherit' }}>
          <strong>Internship Domain:</strong> {data.domain}
        </Typography>
        <Typography sx={{ fontFamily: 'inherit' }}>
          <strong>Total Working Days:</strong> {data.duration}
        </Typography>
        <Typography sx={{ fontFamily: 'inherit' }}>
          <strong>Days Attended:</strong> {data.duration}
        </Typography>
        <Typography sx={{ fontFamily: 'inherit' }}>
          <strong>Attendance Percentage:</strong> 100%
        </Typography>
      </Box>

      <Typography sx={{ fontFamily: 'inherit', mb: 3, textAlign: 'justify' }}>
        We appreciate the student’s participation and wish {objPronoun} success in their future endeavors.
      </Typography>
    </CertificateLayout>
  );
};

export const ProjectCompletionLetterTemplate = ({ data }) => {
  const pronoun = data.salutation === 'Mr.' ? 'He' : 'She';
  
  // Custom formatter for "08th" style string
  const formatOrdinal = (date) => {
      const d = dayjs(date);
      const dayStr = d.format('DD'); // e.g. "08"
      const ordinal = d.date() === 1 || d.date() === 21 || d.date() === 31 ? 'st' : d.date() === 2 || d.date() === 22 ? 'nd' : d.date() === 3 || d.date() === 23 ? 'rd' : 'th';
      return `${dayStr}${ordinal} ${d.format('MMMM YYYY')}`;
  };

  return (
    <CertificateLayout title="PROJECT COMPLETION LETTER" date={dayjs(data.endDate).format('YYYY-MM-DD')}>
      <Typography sx={{ fontFamily: 'inherit', mb: 2, textAlign: 'justify' }}>
        This is to certify that <strong>{data.salutation} {data.studentName}</strong>, bearing Register Number: <strong>{data.regNumber}</strong>, pursuing <strong>{data.degree} ({data.department})</strong> at <strong>{data.collegeName}</strong>, has successfully completed the internship project work at <strong>DLK Software Solutions</strong>.
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', mb: 2, textAlign: 'justify' }}>
        The duration of the internship Project work was from {formatOrdinal(data.startDate)} to {formatOrdinal(data.endDate)}.
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', mb: 2, textAlign: 'justify' }}>
        <strong>Domain:</strong> {data.domain}.
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', mb: 2, textAlign: 'justify' }}>
        <strong>Project Title:</strong> {data.projectTitle || `${data.domain} Project`}.
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', mb: 2, textAlign: 'justify' }}>
        During the period, the student actively participated in the sessions and successfully completed the assigned tasks and activities. {pronoun} demonstrated good learning ability, dedication, and professionalism throughout the internship.
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', mb: 2, textAlign: 'justify' }}>
        We appreciate their interest in DLK Software Solutions and wish them success in all future endeavors.
      </Typography>
    </CertificateLayout>
  );
};
