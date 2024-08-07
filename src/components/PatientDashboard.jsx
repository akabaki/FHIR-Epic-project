// src/components/PatientDashboard.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import avatar from '../assets/avatar_logo.png'
import { fetchPatientData, fetchMedications, fetchLabReports, fetchVitalSigns } from '../utils/DataFetching';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #1cbb9b;
`;

const Section = styled.div`
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px; /* Adjust as needed */
  padding: 10px;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;


const Title = styled.h2`
  color: #FFF;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin: 5px 0;
`;
const Avatar = styled.img`
  display: block;
  margin: 20px auto;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid #ddd;
`;

const PatientDashboard = () => {
const accessToken = localStorage.getItem("access_token")
  const [patient, setPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [vitalSigns, setVitalSigns] = useState([]);


  useEffect(() => {
    if (accessToken) {
      // Fetch patient data
      fetchPatientData(accessToken).then(data => setPatient(data));

      // Fetch medications
      fetchMedications(accessToken).then(data => setMedications(data));

      // Fetch lab reports
      fetchLabReports(accessToken).then(data => setLabReports(data));

      // Fetch vital signs
      fetchVitalSigns(accessToken).then(data => setVitalSigns(data));
    }
    
    
  }, [accessToken]);

  if (!patient) return <div>Loading...</div>;

  return (
    <Container>
        <Avatar src={avatar} alt="Patient Avatar" />
      <Section>
        <Title>Patient Information</Title>
        <div>Name: {patient.name}</div>
        <div>Gender: {patient.gender}</div>
        <div>Date of Birth: {patient.birthDate}</div>
        <div>Identifier: {patient.identifier}</div>
      </Section>

      <Section>
        <Title>Medications</Title>
        <List>
          {medications.map(medication => (
            <ListItem key={medication.id}>{medication.name}</ListItem>
          ))}
        </List>
      </Section>

      <Section>
        <Title>Lab Reports</Title>
        <List>
          {labReports.map(report => (
            <ListItem key={report.id}>{report.title}</ListItem>
          ))}
        </List>
      </Section>

      <Section>
        <Title>Vital Signs</Title>
        <List>
          {vitalSigns.map(vital => (
            <ListItem key={vital.id}>{vital.type}: {vital.value} {vital.unit}</ListItem>
          ))}
        </List>
      </Section>
    </Container>
  );
};

export default PatientDashboard;
