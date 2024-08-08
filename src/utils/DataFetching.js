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
  
  

// src/utils/LabReportsData.js

export const fetchLabReports = async (accessToken) => {
    const API_BASE_URL = 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';
  
    try {
      const response = await fetch(`${API_BASE_URL}/DiagnosticReport?patient=erXuFYUfucBZaryVksYEcMg3`, {
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Filter out entries with "resourceType": "OperationOutcome"
      const filteredEntries = (data.entry || []).filter(entry => entry.resource.resourceType !== 'OperationOutcome');
      
      // Check if the data and properties are defined
      return filteredEntries.map(entry => ({
        id: entry.resource.id || 'Unknown',
        title: entry.resource.code?.text || 'Unknown',
      }));
    } catch (error) {
      console.error('Error fetching lab reports:', error);
      return [];
    }
  };
  
  

  // src/utils/DataFetching.js
  export const fetchVitalSigns = async (accessToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Observation?patient=erXuFYUfucBZaryVksYEcMg3&category=vital-signs`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(`URL:${`${API_BASE_URL}/Observation?code=vital-signs`} data:${data}`);
  
      // Check if the entry array exists
      const entries = (data.entry || []).filter(entry => entry.resource.resourceType !== 'OperationOutcome');
  
      return entries.map(entry => {
        const resource = entry.resource;
        let vitalSign = {
          id: resource.id || 'Unknown',
          type: resource.code.text || 'Unknown',
          value: 'Unknown',
          unit: 'Unknown',
          date: resource.effectiveDateTime || 'Unknown'
        };
  
        // Handle different types of vital signs
        if (resource.code.coding.some(code => code.code === '85354-9')) { // Blood pressure
          const systolicComponent = resource.component?.find(c => c.code.coding.some(code => code.code === '8480-6'));
          const diastolicComponent = resource.component?.find(c => c.code.coding.some(code => code.code === '8462-4'));
          vitalSign.value = systolicComponent && diastolicComponent 
            ? `${systolicComponent.valueQuantity.value}/${diastolicComponent.valueQuantity.value}` 
            : 'Unknown';
          vitalSign.unit = systolicComponent ? systolicComponent.valueQuantity.unit : 'Unknown';
        } else if (resource.code.coding.some(code => code.code === '8310-5')) { // Temperature
          vitalSign.value = resource.valueQuantity ? resource.valueQuantity.value : 'Unknown';
          vitalSign.unit = resource.valueQuantity ? resource.valueQuantity.unit : 'Unknown';
        } else if (resource.code.coding.some(code => code.code === '8867-4')) { // Pulse
          vitalSign.value = resource.valueQuantity ? resource.valueQuantity.value : 'Unknown';
          vitalSign.unit = resource.valueQuantity ? resource.valueQuantity.unit : 'Unknown';
        } else if (resource.code.coding.some(code => code.code === '29463-7')) { // Weight
          vitalSign.value = resource.valueQuantity ? resource.valueQuantity.value : 'Unknown';
          vitalSign.unit = resource.valueQuantity ? resource.valueQuantity.unit : 'Unknown';
        } else if (resource.code.coding.some(code => code.code === '8302-2')) { // Height
          vitalSign.value = resource.valueQuantity ? resource.valueQuantity.value : 'Unknown';
          vitalSign.unit = resource.valueQuantity ? resource.valueQuantity.unit : 'Unknown';
        }
  
        return vitalSign;
      });
    } catch (error) {
      console.error('Error fetching vital signs:', error);
      return [];
    }
  };