import emailjs from '@emailjs/browser';

export type ResultEmailPayload = {
  to_email: string;
  to_name?: string;
  goal_label: string;
  target_amount: string;
  duration_years: string;
  target_year: string;
  monthly_savings: string;
  strategy_label: string;
  strategy_rate_label: string;
  total_invested: string;
  total_return: string;
  zero_return_monthly: string;
  monthly_difference: string;
  date_label: string;
  result_summary: string;
  result_interpretation: string;
};

export type SendEmailResult =
  | { ok: true }
  | { ok: false; code: 'missing_config' | 'validation_error' | 'provider_error'; message: string };

type EmailConfig = {
  serviceId: string;
  templateId: string;
  publicKey: string;
  fromName: string;
};

export type EmailPublicConfig = {
  emailjsServiceId?: string;
  emailjsTemplateId?: string;
  emailjsPublicKey?: string;
  emailFromName?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const getEmailConfig = (publicConfig: EmailPublicConfig): EmailConfig | null => {
  const serviceId = publicConfig.emailjsServiceId;
  const templateId = publicConfig.emailjsTemplateId;
  const publicKey = publicConfig.emailjsPublicKey;
  const fromName = publicConfig.emailFromName || 'Sparc Light POC';

  if (!serviceId || !templateId || !publicKey) {
    return null;
  }

  return { serviceId, templateId, publicKey, fromName };
};

export const isEmailConfigured = (publicConfig: EmailPublicConfig): boolean =>
  getEmailConfig(publicConfig) !== null;

export const validateRecipientEmail = (email: string): boolean => EMAIL_REGEX.test(email.trim());

export const sendResultEmail = async (
  payload: ResultEmailPayload,
  publicConfig: EmailPublicConfig
): Promise<SendEmailResult> => {
  const config = getEmailConfig(publicConfig);
  if (!config) {
    return {
      ok: false,
      code: 'missing_config',
      message: 'E-Mail-Versand ist nicht konfiguriert (NUXT_PUBLIC_EMAILJS_* fehlt).',
    };
  }

  if (!validateRecipientEmail(payload.to_email)) {
    return {
      ok: false,
      code: 'validation_error',
      message: 'Bitte eine gültige E-Mail-Adresse eingeben.',
    };
  }

  try {
    await emailjs.send(
      config.serviceId,
      config.templateId,
      {
        ...payload,
        from_name: config.fromName,
      },
      { publicKey: config.publicKey }
    );

    return { ok: true };
  } catch (error) {
    console.error('EmailJS send failed:', error);
    return {
      ok: false,
      code: 'provider_error',
      message: 'Versand fehlgeschlagen. Bitte später erneut versuchen.',
    };
  }
};
