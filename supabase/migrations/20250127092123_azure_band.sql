-- Store PayPal credentials securely
SELECT update_paypal_config(
  'ASLheV064vTrn0Y-FIgA3scv7IvmcX5hF0NGHmJEg5_1TE-cuHly4oAKxfgsRkN5GwaDZHa1c1s1LXsO',  -- Client ID
  'EE7vJW_d9rCDnUmKmkkv8EXDe1CNw1LfITlPDd-ePA1EP0G8UwUPzJqtkW7ki44ieRd2BjR6Jh1ziT-N',  -- Secret
  '4D485884RE0215216',  -- Webhook ID
  false                  -- Set to false for production mode
);