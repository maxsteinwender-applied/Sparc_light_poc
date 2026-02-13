
  # Sparc Light – MVP Prototyp

  This is a code bundle for Sparc Light – MVP Prototyp. The original project is available at https://www.figma.com/design/MZH6L2CFLlDBQGmrTMOvE2/Sparc-Light-%E2%80%93-MVP-Prototyp.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## E-Mail POC setup (EmailJS)

  The "Ergebnis per E-Mail senden" button uses EmailJS directly from the browser (POC only).

  1. Copy `.env.example` to `.env`.
  2. Fill these values from your EmailJS project:
     - `VITE_EMAILJS_SERVICE_ID`
     - `VITE_EMAILJS_TEMPLATE_ID`
     - `VITE_EMAILJS_PUBLIC_KEY`
     - `VITE_EMAIL_FROM_NAME` (optional, defaults to `Sparc Light POC`)
  3. Create an EmailJS template with variables used by the app:
     - `to_email`, `to_name`, `from_name`
     - `goal_label`, `target_amount`, `duration_years`, `target_year`
     - `monthly_savings`, `strategy_label`, `strategy_rate_label`
     - `total_invested`, `total_return`
     - `zero_return_monthly`, `monthly_difference`
     - `date_label`, `result_summary`, `result_interpretation`

  Notes:
  - This is intentionally client-side and not secure enough for production.
  - The POC includes simple email validation and a 30-second cooldown.

  ## Chart provider

  The result page supports a provider-based chart setup.

  Set `VITE_CHART_PROVIDER` in `.env`:
  - `echarts` (default, OSS-safe)
  - `highcharts` (use when license/setup is available)
  
