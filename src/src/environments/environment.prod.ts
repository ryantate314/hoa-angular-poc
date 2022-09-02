import secrets from '../../auth_config.json';

const { domain, clientId, audience } = secrets as {
  domain: string;
  clientId: string;
  audience?: string;
};

export const environment = {
  production: true,
  apiUrl: 'localhost:4000/api/v1',
  auth: {
    domain: domain,
    clientId: clientId,
    audience: audience
  }
};
