// src/utils/DataFetching.js
import * as jwtDecode from 'jwt-decode';


const API_BASE_URL = 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';
// const API_BASE_URL = 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/DSTU2';

// src/utils/PatientData.js

export const fetchPatientData = async (accessToken) => {
    try {
        // Log the token for inspection
        console.log('Access Token:', accessToken);

     

        const response = await fetch(`${API_BASE_URL}/Patient`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Check if the entry array exists and has at least one item
        const patient = data.entry && data.entry.length > 0 ? data.entry[0].resource : {};

        return {
            name: patient.name && patient.name.length > 0 ? patient.name[0].text : 'Unknown',
            gender: patient.gender || 'Unknown',
            birthDate: patient.birthDate || 'Unknown',
            identifier: patient.id || 'Unknown',
        };
    } catch (error) {
        console.error('Error fetching patient data:', error);
        return {
            name: 'Error',
            gender: 'Error',
            birthDate: 'Error',
            identifier: 'Error',
        };
    }
};

  

// src/utils/MedicationData.js

export const fetchMedications = async (accessToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/MedicationRequest?patient=erXuFYUfucBZaryVksYEcMg3`, {
        headers: { 
          'Authorization': `Bearer ${accessToken}`, 
          'Accept': 'application/json'
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Extract medication data from the response
      return (data.entry || []).map(entry => {
        const medicationResource = entry.resource;
        return {
          id: medicationResource?.id || 'Unknown',
          name: medicationResource?.medicationReference?.display || 'Unknown',
          status: medicationResource?.status || 'Unknown',
          authoredOn: medicationResource?.authoredOn || 'Unknown',
          dosage: medicationResource?.dosageInstruction?.[0]?.text || 'Unknown',
        };
      });
    } catch (error) {
      console.error('Error fetching medications:', error);
      return [];
    }
  };
  
  

  export const fetchLabReports = async (accessToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/DiagnosticReport`, {
        headers: { 'Authorization': `Bearer ${accessToken}`, "Accept":"application/json" },
      });
      const data = await response.json();
      
      // Check if the data and properties are defined
      return (data.entry || []).map(entry => ({
        id: entry.resource?.id || 'Unknown',
        title: entry.resource?.code?.text || 'Unknown',
      }));
    } catch (error) {
      console.error('Error fetching lab reports:', error);
      return [];
    }
  };
  

// src/utils/VitalSignsData.js

export const fetchVitalSigns = async (accessToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Observation?patient=erXuFYUfucBZaryVksYEcMg3&code=vital-signs`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(`URL:${`${API_BASE_URL}/Observation?code=vital-signs`} data:${data}`)
  
      // Check if the entry array exists
      const entries = data.entry || [];
  
      return entries.map(entry => ({
        id: entry.resource?.id || 'Unknown',
        type: entry.resource?.code?.text || 'Unknown',
        value: entry.resource?.valueQuantity?.value || 'Unknown',
        unit: entry.resource?.valueQuantity?.unit || 'Unknown',
      }));
    } catch (error) {
      console.error('Error fetching vital signs:', error);
      return [];
    }
  };
  
