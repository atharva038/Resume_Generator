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

/**
 * Send service apology and resolution notification email
 */
export const sendServiceResolutionEmail = async ({
  email,
  userName = "User",
  feature = "AI Resume Scanner",
}) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"SmartNShine Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Update: ${feature} is Fully Operational - SmartNShine`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%); color: #ffffff; padding: 36px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
            .badge { display: inline-block; padding: 4px 12px; background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #34d399; border-radius: 999px; font-size: 12px; font-weight: 700; margin-bottom: 12px; }
            .content { padding: 32px 30px; }
            .greeting { font-size: 17px; font-weight: 600; color: #0f172a; margin-bottom: 16px; }
            .card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; margin: 20px 0; }
            .card h3 { margin: 0 0 8px 0; color: #15803d; font-size: 16px; display: flex; align-items: center; gap: 8px; }
            .card p { margin: 0; color: #166534; font-size: 14px; }
            .btn-container { text-align: center; margin: 28px 0; }
            .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
            .note-box { background: #f8fafc; border-left: 4px solid #6366f1; padding: 14px; border-radius: 6px; font-size: 13px; color: #475569; margin: 20px 0; }
            .footer { text-align: center; padding: 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="badge">SERVICE UPDATE & RESOLUTION</div>
              <h1>AI Services Upgraded & Ready</h1>
            </div>
            <div class="content">
              <p class="greeting">Hello ${userName},</p>
              <p>We noticed you experienced a temporary issue while running an AI ATS Resume scan on SmartNShine recently. We sincerely apologize for any inconvenience this caused.</p>
              
              <div class="card">
                <h3>✅ Issue Resolved & Upgraded to GPT-4o</h3>
                <p>Our engineering team has resolved the underlying model routing issue and fully upgraded our core AI engine to OpenAI GPT-4o. The ATS Resume Scanner, Bullet Point Enhancer, and AI Mock Interviewer are now running at full capacity with enhanced speed and accuracy.</p>
              </div>

              <p>You can now log back into your account and run your resume scans and enhancements seamlessly.</p>

              <div class="btn-container">
                <a href="${process.env.CLIENT_URL || "https://smartnshine.app"}/ats-analyzer" class="button">Scan Your Resume Now &rarr;</a>
              </div>

              <div class="note-box">
                <strong>📩 Need Assistance?</strong><br>
                Our support team is always here for you. You can reach out directly via our Contact page or reply to this email, and our team will assist you right away.
              </div>

              <p style="margin-top: 24px;">Thank you for being part of SmartNShine.<br><strong>The SmartNShine Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} SmartNShine. All rights reserved.</p>
              <p>Empowering professionals with AI-optimized ATS resumes & portfolios.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Service resolution email sent to:", email);
    return true;
  } catch (error) {
    console.error("❌ Error sending service resolution email:", error);
    return false;
  }
};

/**
 * Send customized branded template email from Admin panel
 */
export const sendCustomAdminTemplateEmail = async ({
  toEmail,
  userName = "Valued User",
  subject,
  badgeText = "SMARTNSHINE UPDATE",
  heading = "Important Update Regarding Your Account",
  bodyMessage = "",
  cardTitle = "",
  cardMessage = "",
  buttonText = "",
  buttonUrl = "",
  noteBox = "",
  sendCopyAdmin = true,
}) => {
  try {
    const transporter = createTransporter();
    const clientUrl = process.env.CLIENT_URL || "https://smartnshine.app";

    // Dynamic variable replacements
    const formatVars = (str) =>
      (str || "")
        .replace(/{name}/g, userName || "User")
        .replace(/{email}/g, toEmail)
        .replace(/{app_url}/g, clientUrl);

    const formattedHeading = formatVars(heading);
    const formattedBadge = formatVars(badgeText);
    const formattedBody = formatVars(bodyMessage);
    const formattedCardTitle = formatVars(cardTitle);
    const formattedCardMessage = formatVars(cardMessage);
    const formattedNote = formatVars(noteBox);
    const formattedBtnText = formatVars(buttonText);
    const formattedBtnUrl = formatVars(buttonUrl);

    const mailOptions = {
      from: `"SmartNShine Support" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      bcc: sendCopyAdmin && process.env.EMAIL_USER !== toEmail ? process.env.EMAIL_USER : undefined,
      subject: formatVars(subject) || "Update from SmartNShine",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%); color: #ffffff; padding: 36px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 23px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.3; }
            .badge { display: inline-block; padding: 4px 12px; background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #34d399; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 12px; }
            .content { padding: 32px 30px; }
            .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 16px; }
            .body-text { font-size: 15px; color: #334155; line-height: 1.7; white-space: pre-line; }
            .card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; margin: 20px 0; }
            .card h3 { margin: 0 0 8px 0; color: #15803d; font-size: 15px; font-weight: 700; }
            .card p { margin: 0; color: #166534; font-size: 14px; line-height: 1.5; white-space: pre-line; }
            .btn-container { text-align: center; margin: 28px 0; }
            .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
            .note-box { background: #f8fafc; border-left: 4px solid #6366f1; padding: 14px; border-radius: 6px; font-size: 13px; color: #475569; margin: 20px 0; line-height: 1.5; }
            .footer { text-align: center; padding: 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              ${formattedBadge ? `<div class="badge">${formattedBadge}</div>` : ""}
              <h1>${formattedHeading}</h1>
            </div>
            <div class="content">
              <p class="greeting">Hello ${userName || "Valued User"},</p>
              
              <div class="body-text">${formattedBody}</div>

              ${
                formattedCardTitle || formattedCardMessage
                  ? `
                <div class="card">
                  ${formattedCardTitle ? `<h3>${formattedCardTitle}</h3>` : ""}
                  ${formattedCardMessage ? `<p>${formattedCardMessage}</p>` : ""}
                </div>
              `
                  : ""
              }

              ${
                formattedBtnText && formattedBtnUrl
                  ? `
                <div class="btn-container">
                  <a href="${formattedBtnUrl}" class="button">${formattedBtnText} &rarr;</a>
                </div>
              `
                  : ""
              }

              ${
                formattedNote
                  ? `
                <div class="note-box">
                  ${formattedNote}
                </div>
              `
                  : ""
              }

              <p style="margin-top: 24px; font-size: 14px; color: #475569;">
                Best regards,<br>
                <strong style="color: #0f172a;">The SmartNShine Team</strong>
              </p>
            </div>
            <div class="footer">
              <p><strong>SmartNShine - AI-Powered Resume & Career Platform</strong></p>
              <p>&copy; ${new Date().getFullYear()} SmartNShine. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Admin email successfully sent to ${toEmail}. MessageId:`, info.messageId);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Failed to send custom admin email:", error);
    throw new Error(error.message || "Failed to send email");
  }
};


