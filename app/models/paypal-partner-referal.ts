import { User } from "./user";

export class PaypalPartnerReferal {
  id: number;
  partner_referral_id: string;
  client_id: string;
  email: string;
  tracking_id: string;
  merchantIdInPayPal: string;
  permissionsGranted: boolean;
  accountStatus: string;
  consentStatus: boolean;
  productIntentId: string;
  isEmailConfirmed: boolean;
  returnMessage: string;
  riskStatus: string;
  operations: Operation[];
  products: string[];
  dbproducts: string;
  legal_consents: LegalConsent[];
  partner_config_override: PartnerConfigOverride;
  userId: number;
  user: User;
  links: ReferalLink[];
  createdAt: string;
  updateAt: string | null;
}

export class PartnerConfigOverride {
  id: number;
  partner_logo_url: string;
  return_url: string;
  return_url_description: string;
  action_renewal_url: string;
  show_add_credit_card: boolean;
}

export class ThirdPartyDetails {
  id: number;
  features: string[];
  dbfeatures: string;
}

export class RestApiIntegration {
  id: number;
  integration_method: string;
  integration_type: string;
  third_party_details: ThirdPartyDetails;
}

export class ApiIntegrationPreference {
  id: number;
  rest_api_integration: RestApiIntegration;
}

export class Operation {
  id: number;
  operation: string;
  api_integration_preference: ApiIntegrationPreference;
}

export class LegalConsent {
  id: number;
  type: string;
  granted: boolean;
}

export class ReferalLink {
  id: number;
  href: string;
  rel: string;
  method: string;
  description: string;
  paypalPartnerReferal: PaypalPartnerReferal;
}
