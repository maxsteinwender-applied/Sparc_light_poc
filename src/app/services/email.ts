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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const getEmailConfig = (): EmailConfig | null => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
  const fromName = (import.meta.env.VITE_EMAIL_FROM_NAME as string | undefined) || 'Sparc Light POC';

  if (!serviceId || !templateId || !publicKey) {
    return null;
  }

  return { serviceId, templateId, publicKey, fromName };
};

export const isEmailConfigured = (): boolean => getEmailConfig() !== null;

export const validateRecipientEmail = (email: string): boolean => EMAIL_REGEX.test(email.trim());

export const sendResultEmail = async (payload: ResultEmailPayload): Promise<SendEmailResult> => {
  const config = getEmailConfig();
  if (!config) {
    return {
      ok: false,
      code: 'missing_config',
      message: 'E-Mail-Versand ist nicht konfiguriert (VITE_EMAILJS_* fehlt).',
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

