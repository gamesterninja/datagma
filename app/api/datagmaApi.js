const API_ID = process.env.NEXT_PUBLIC_DATAGMA_API_ID;
const BASE_URL = 'https://gateway.datagma.net/api/ingress';

export async function searchGeneral(params) {
  const url = new URL(`${BASE_URL}/v2/full`);
  url.searchParams.append('apiId', API_ID);
  url.searchParams.append('fullName', params.fullName);
  url.searchParams.append('data', params.companyName || params.socialUrl);
  url.searchParams.append('phoneFull', 'true');
  url.searchParams.append('companyFull', 'true');
  url.searchParams.append('personFull', 'true');
  if (params.whatsappCheck) {
    url.searchParams.append('whatsappCheck', 'true');
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`General API responded with status ${response.status}`);
  }
  return response.json();
}

export async function findEmail(params) {
  const url = new URL(`${BASE_URL}/v6/findEmail`);
  url.searchParams.append('apiId', API_ID);
  url.searchParams.append('fullName', params.fullName);
  url.searchParams.append('company', params.companyName);
  url.searchParams.append('findEmailV2Step', '3');
  url.searchParams.append('findEmailV2Country', params.country);
  if (params.email) {
    url.searchParams.append('email', params.email);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Email API responded with status ${response.status}`);
  }
  return response.json();
}