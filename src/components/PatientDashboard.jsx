import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import avatar from '../assets/avatar_logo.png';
import { fetchPatientData, fetchMedications, fetchLabReports, fetchVitalSigns } from '../utils/DataFetching';
import VitalSignsChart from '../components/VitalSignsChart'; // Import the chart component

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #1cbb9b;
`;

const Section = styled.div`
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
  padding: 10px;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
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

const VitalItem = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${({ critical }) => (critical ? '#ffdddd' : '#f5f5f5')};
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 4px;
`;

const DateText = styled.div`
  font-size: 0.9rem;
  color: #888;
`;

const Value = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
`;

const PatientDashboard = () => {
  const accessToken = localStorage.getItem('access_token');
  const [patient, setPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [vitalSigns, setVitalSigns] = useState([]);

  useEffect(() => {
    if (accessToken) {
      fetchPatientData(accessToken).then(data => setPatient(data));
      fetchMedications(accessToken).then(data => setMedications(data));
      fetchLabReports(accessToken).then(data => setLabReports(data));
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
        {vitalSigns.map(vital => (
          <VitalItem key={vital.id} critical={vital.critical}>
            <Value>{vital.type}: {vital.value} {vital.unit}</Value>
            <DateText>{new window.Date(vital.date).toLocaleString()}</DateText>
          </VitalItem>
        ))}
      </Section>

      <Section>
        <Title>Vital Signs Trends</Title>
        <VitalSignsChart data={vitalSigns} />
      </Section>
    </Container>
  );
};

export default PatientDashboard;
