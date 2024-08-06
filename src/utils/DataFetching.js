// src/utils/DataFetching.js

const API_BASE_URL = 'https://fhir.epic.com/interconnect-fhir-oauth/fhir';

export const fetchPatientData = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/Patient`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  const data = await response.json();
  return {
    name: data.name[0].text,
    gender: data.gender,
    birthDate: data.birthDate,
    identifier: data.id,
  };
};

export const fetchMedications = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/MedicationRequest`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  const data = await response.json();
  return data.entry.map(entry => ({
    id: entry.resource.id,
    name: entry.resource.medicationCodeableConcept.text,
  }));
};

export const fetchLabReports = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/DiagnosticReport`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  const data = await response.json();
  return data.entry.map(entry => ({
    id: entry.resource.id,
    title: entry.resource.code.text,
  }));
};

export const fetchVitalSigns = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/Observation?code=vital-signs`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  const data = await response.json();
  return data.entry.map(entry => ({
    id: entry.resource.id,
    type: entry.resource.code.text,
    value: entry.resource.valueQuantity.value,
    unit: entry.resource.valueQuantity.unit,
  }));
};
