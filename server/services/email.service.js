import nodemailer from "nodemailer";

// Create transporter
const createTransporter = () => {
  // Use environment variables for email configuration
  if (process.env.EMAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    });
  }

  // Default: Use SMTP configuration
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const transporter = createTransporter();

    // Create reset URL (for frontend)
    const resetUrl = `${
      process.env.CLIENT_URL || "http://localhost:5173"
    }/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"SmartNShine Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request - SmartNShine",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
            .warning {
              background: #fef2f2;
              border-left: 4px solid #ef4444;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              
              <p>We received a request to reset your password for your SmartNShine account. Click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #9333ea;"><a href="${resetUrl}">${resetUrl}</a></p>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This link will expire in <strong>1 hour</strong></li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password won't change until you create a new one</li>
                </ul>
              </div>
              
              <p>If you're having trouble clicking the button, copy and paste the URL above into your web browser.</p>
              
              <p>Best regards,<br><strong>SmartNShine Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} SmartNShine. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent to:", email);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send password reset email");
  }
};

// Send password change confirmation email
export const sendPasswordChangeConfirmation = async (email, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"SmartNShine Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Changed Successfully - SmartNShine",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
            .alert {
              background: #fef2f2;
              border-left: 4px solid #ef4444;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Password Changed Successfully</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              
              <p>This email confirms that your password was successfully changed.</p>
              
              <p><strong>Changed at:</strong> ${new Date().toLocaleString()}</p>
              
              <div class="alert">
                <strong>⚠️ Didn't make this change?</strong>
                <p>If you didn't change your password, please contact our support team immediately at support@smartnshine.app</p>
              </div>
              
              <p>Best regards,<br><strong>SmartNShine Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} SmartNShine. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Password change confirmation sent to:", email);
    return true;
  } catch (error) {
    console.error("❌ Error sending confirmation email:", error);
    // Don't throw error - this is just a confirmation email
    return false;
  }
};

// Send payment confirmation email with receipt
export const sendPaymentConfirmationEmail = async (
  email,
  userName,
  paymentDetails
) => {
  try {
    const transporter = createTransporter();

    const {
      receiptId,
      tier,
      plan,
      amount,
      paymentId,
      orderId,
      transactionDate,
      startDate,
      endDate,
    } = paymentDetails;

    // Format dates
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    // Get plan display name
    const getPlanName = (tier, plan) => {
      if (tier === "one-time") return "One-Time Plan (21 Days)";
      if (tier === "pro" && plan === "monthly") return "Pro Monthly";
      if (tier === "pro" && plan === "yearly") return "Pro Yearly";
      return `${tier} - ${plan}`;
    };

    const mailOptions = {
      from: `"SmartNShine" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Payment Successful - Receipt #${receiptId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 650px;
              margin: 20px auto;
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .success-icon {
              font-size: 60px;
              margin-bottom: 10px;
            }
            .content {
              padding: 40px 30px;
            }
            .receipt-box {
              background: #f9fafb;
              border: 2px dashed #e5e7eb;
              border-radius: 8px;
              padding: 25px;
              margin: 25px 0;
            }
            .receipt-header {
              text-align: center;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .receipt-id {
              font-size: 18px;
              font-weight: bold;
              color: #3b82f6;
            }
            .receipt-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .receipt-row:last-child {
              border-bottom: none;
            }
            .receipt-label {
              font-weight: 600;
              color: #6b7280;
            }
            .receipt-value {
              color: #111827;
              font-weight: 500;
            }
            .amount-row {
              background: #eff6ff;
              margin: 15px -10px;
              padding: 15px 10px;
              border-radius: 6px;
            }
            .amount-value {
              font-size: 24px;
              font-weight: bold;
              color: #3b82f6;
            }
            .subscription-details {
              background: #f0fdf4;
              border-left: 4px solid #22c55e;
              padding: 20px;
              margin: 25px 0;
              border-radius: 6px;
            }
            .button {
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              margin: 20px 0;
              font-weight: bold;
              text-align: center;
            }
            .footer {
              background: #f9fafb;
              padding: 30px;
              text-align: center;
              color: #6b7280;
              font-size: 13px;
            }
            .info-box {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
              border-radius: 6px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">✅</div>
              <h1>Payment Successful!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.95;">Thank you for your purchase</p>
            </div>
            
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              
              <p>Your payment has been successfully processed. Here are your transaction details:</p>
              
              <div class="receipt-box">
                <div class="receipt-header">
                  <div style="color: #6b7280; font-size: 14px; margin-bottom: 5px;">PAYMENT RECEIPT</div>
                  <div class="receipt-id">Receipt #${receiptId}</div>
                </div>
                
                <div class="receipt-row">
                  <span class="receipt-label">Date & Time:</span>
                  <span class="receipt-value">${formatDate(
                    transactionDate
                  )} ${new Date(transactionDate).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })}</span>
                </div>
                
                <div class="receipt-row">
                  <span class="receipt-label">Plan:</span>
                  <span class="receipt-value">${getPlanName(tier, plan)}</span>
                </div>
                
                <div class="receipt-row">
                  <span class="receipt-label">Payment ID:</span>
                  <span class="receipt-value">${paymentId}</span>
                </div>
                
                <div class="receipt-row">
                  <span class="receipt-label">Order ID:</span>
                  <span class="receipt-value">${orderId}</span>
                </div>
                
                <div class="amount-row receipt-row">
                  <span class="receipt-label">Amount Paid:</span>
                  <span class="amount-value">₹${amount.toFixed(2)}</span>
                </div>
              </div>
              
              <div class="subscription-details">
                <h3 style="margin-top: 0; color: #22c55e;">🎉 Your Subscription is Active!</h3>
                <p style="margin: 10px 0;"><strong>Active From:</strong> ${formatDate(
                  startDate
                )}</p>
                <p style="margin: 10px 0;"><strong>Valid Until:</strong> ${formatDate(
                  endDate
                )}</p>
                <p style="margin: 10px 0; color: #6b7280; font-size: 14px;">
                  You now have full access to all premium features.
                </p>
              </div>
              
              <div style="text-align: center;">
                <a href="${
                  process.env.CLIENT_URL || "http://localhost:5173"
                }/dashboard" class="button">
                  Go to Dashboard
                </a>
              </div>
              
              <div class="info-box">
                <strong>💡 Important:</strong> Save this email for your records. You'll need the <strong>Payment ID</strong> if you need to request a refund within 24 hours.
              </div>
              
              <p style="margin-top: 30px;">If you have any questions or need assistance, please contact us at <strong>support@smartnshine.app</strong></p>
              
              <p>Best regards,<br><strong>SmartNShine Team</strong></p>
            </div>
            
            <div class="footer">
              <p><strong>SmartNShine - AI Resume Builder</strong></p>
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} SmartNShine. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Payment confirmation email sent to:", email);
    return true;
  } catch (error) {
    console.error("❌ Error sending payment confirmation email:", error);
    // Don't throw error - payment was successful even if email fails
    return false;
  }
};
