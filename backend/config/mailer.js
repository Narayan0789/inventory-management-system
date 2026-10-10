const nodemailer = require('nodemailer');

// Configure Gmail Transporter if credentials exist in .env
const createTransporter = () => {
  const user = process.env.GMAIL_USER ? process.env.GMAIL_USER.trim() : null;
  const rawPass = process.env.GMAIL_APP_PASSWORD;
  const pass = rawPass ? rawPass.replace(/\s+/g, '') : null;

  if (user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }
  return null;
};

// Send OTP to user's Gmail
const sendOtpEmail = async (toEmail, otp, name = 'User') => {
  const transporter = createTransporter();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #4f46e5; margin: 0;">StockPilot IMS</h2>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Password Reset Verification Code</p>
      </div>
      <p style="color: #334155; font-size: 14px;">Hello <strong>${name}</strong>,</p>
      <p style="color: #475569; font-size: 14px; line-height: 1.5;">
        You recently requested to reset your password for your StockPilot Inventory account. Use the 6-digit OTP below to proceed:
      </p>
      <div style="background: #f8fafc; border: 2px dashed #6366f1; border-radius: 8px; padding: 15px; text-align: center; margin: 25px 0;">
        <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1e1b4b;">${otp}</span>
      </div>
      <p style="color: #dc2626; font-size: 12px; margin-bottom: 20px;">
        ⚠️ This code is valid for <strong>10 minutes</strong> only. Do not share it with anyone.
      </p>
      <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 11px; text-align: center;">
        If you did not request this password reset, please ignore this email.
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"StockPilot IMS" <${process.env.GMAIL_USER}>`,
        to: toEmail,
        subject: `Your StockPilot Password Reset OTP: ${otp}`,
        html: htmlContent
      });
      console.log(`✅ [GMAIL SMTP SENT]: OTP successfully sent to ${toEmail}`);
      return { success: true, mode: 'smtp' };
    } catch (err) {
      console.warn(`⚠️ [SMTP ERROR]: ${err.message}. Falling back to terminal display.`);
    }
  }

  // Fallback for offline/college demo: log prominently to terminal
  console.log(`\n============================================================`);
  console.log(`📩 [GMAIL OTP DISPATCH FOR: ${toEmail}]`);
  console.log(`🔑 OTP CODE: ${otp} (Valid for 10 minutes)`);
  console.log(`ℹ️ To send real Gmails, set GMAIL_USER & GMAIL_APP_PASSWORD in backend/.env`);
  console.log(`============================================================\n`);

  return { success: true, mode: 'console' };
};

module.exports = { sendOtpEmail };
