 const express = require('express');
  const cors = require('cors');
  const dotenv = require('dotenv');
  const Razorpay = require('razorpay');

  dotenv.config();

  const app = express();

  app.use(cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
  }));
  app.use(express.json());

  const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  app.post('/api/create-payment-link', async (req, res) => {
      try {
          const { amount, description, customerEmail } = req.body;

          const paymentLinkRequest = {
              amount: amount * 100,
              currency: "INR",
              accept_partial: false,
              description: description || "Payment Recovery",
              // Removed customer contact field entirely to avoid Razorpay validation errors
              customer: {
                  email: customerEmail || "recovery@recoverflow.app",
              },
              notify: {
                  sms: false,  // turned off since we have no phone number
                  email: true
              },
              reminder_enable: true
          };

          const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

          res.json({
              success: true,
              link: paymentLink.short_url,
              id: paymentLink.id
          });

      } catch (error) {
          console.error("Razorpay Error:", error);
          res.status(500).json({ success: false, message: "Failed to generate payment link" });
      }
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
      console.log(`Backend Server running on http://localhost:${PORT}`);
  });