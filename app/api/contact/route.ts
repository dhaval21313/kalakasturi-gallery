import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import nodemailer from 'nodemailer';

// Email validation pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Nodemailer SMTP transporter configuration with dev mock fallback
const getTransporter = async () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465');
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass || pass === 'placeholder_app_password' || pass === 'your_app_password_here' || user === 'care.kalakasturi@gmail.com' && pass === 'placeholder_app_password') {
    console.warn("SMTP credentials are not configured or are placeholders. Setting up safe test account on Ethereal...");
    try {
      const testAccount = await nodemailer.createTestAccount();
      const mockTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      return {
        transporter: mockTransporter,
        isMock: true,
        testAccount
      };
    } catch (mockErr) {
      console.error("Ethereal test account initialization failed. Simulating local mock transmitter.", mockErr);
      return {
        transporter: {
          sendMail: async (mailOptions: any) => {
            console.log("SIMULATED CONTACT MAIL DISPATCH (No active SMTP):", mailOptions.subject);
            return { messageId: 'simulated-msg-id-contact-1000' };
          }
        } as any,
        isMock: true
      };
    }
  }

  // Real Production SMTP Transport Configuration
  const productionTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });

  return {
    transporter: productionTransporter,
    isMock: false
  };
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      subject,
      message,
      website // Spam Honeypot Field
    } = body;

    // 1. Honeypot Spam Bot Filter
    if (website && website.trim() !== '') {
      console.warn("Spambot activity detected via honeypot. Ignoring submission.");
      return NextResponse.json({
        success: true,
        message: "Message Sent",
        spamBlocked: true
      });
    }

    // 2. Server-side Validation
    const errors: string[] = [];
    if (!name || name.trim().length < 2) {
      errors.push("Full name must be at least 2 characters.");
    }
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      errors.push("Please provide a valid email address.");
    }
    if (!message || message.trim().length < 10) {
      errors.push("Your message must contain at least 10 characters.");
    }

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        message: errors.join(" ")
      }, { status: 400 });
    }

    // Map subject codes to human readable titles
    const subjectsMap: Record<string, string> = {
      general: 'General Inquiry',
      commission: 'Custom Commission Request',
      shipping: 'Shipping & Delivery Inquiry',
      other: 'Other Inquiry'
    };
    const humanSubject = subjectsMap[subject] || subject || 'General Inquiry';

    // 3. Store submission in database (Firestore)
    let isStored = false;
    let storeErrorMsg = "";

    try {
      if (db) {
        await addDoc(collection(db, "contact_messages"), {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          subject: subject || 'general',
          subjectLabel: humanSubject,
          message: message.trim(),
          submittedAt: serverTimestamp(),
          serverProcessed: true
        });
        isStored = true;
      } else {
        console.warn("Firestore database initialization failed. Local caching is advised.");
        storeErrorMsg = "Database connection offline.";
      }
    } catch (dbErr: any) {
      console.error("Error writing contact message to Firestore:", dbErr);
      storeErrorMsg = dbErr.message || "Failed to persist to database.";
    }

    // 4. Email Transporter Initialization
    const { transporter, isMock, testAccount } = await getTransporter();
    const adminInbox = process.env.ADMIN_EMAIL || 'care.kalakasturi@gmail.com';
    const emailSender = process.env.SMTP_FROM || '"KalaKasturi Art Gallery" <care.kalakasturi@gmail.com>';

    // Render HTML Message Notification for Admin
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Message - KalaKasturi</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #050505; color: #E5E5E5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #0F0F0F; border: 1px solid #C19A6B; border-radius: 16px; padding: 30px; }
          .header { text-align: center; border-bottom: 1px solid rgba(193, 154, 107, 0.2); padding-bottom: 20px; margin-bottom: 25px; }
          .logo { font-size: 24px; letter-spacing: 2px; color: #FFFFFF; font-weight: bold; }
          .gold-accent { color: #C19A6B; }
          .title { font-size: 20px; margin-top: 10px; color: #FFFFFF; }
          .details-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          .details-table td { padding: 12px 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); vertical-align: top; }
          .details-table td.label { font-weight: bold; width: 35%; color: #C19A6B; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
          .details-table td.value { color: #F5F5F5; font-size: 14px; }
          .msg-box { background-color: rgba(255, 255, 255, 0.02); border-left: 3px solid #C19A6B; padding: 15px; border-radius: 4px; color: #D4D4D4; line-height: 1.6; white-space: pre-wrap; font-size: 14px; }
          .footer { text-align: center; font-size: 11px; color: #666; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 15px; margin-top: 25px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">KALA <span class="gold-accent">KASTURI</span></div>
            <div class="title">New Gallery Inquiry Received</div>
          </div>
          
          <table class="details-table">
            <tr>
              <td class="label">Sender Name</td>
              <td class="value">${name}</td>
            </tr>
            <tr>
              <td class="label">Email Address</td>
              <td class="value"><a href="mailto:${email}" style="color:#C19A6B; text-decoration:none;">${email}</a></td>
            </tr>
            <tr>
              <td class="label">Topic / Subject</td>
              <td class="value" style="font-weight:bold; color:#FFFFFF;">${humanSubject}</td>
            </tr>
            <tr>
              <td class="label">System Status</td>
              <td class="value" style="font-size:12px; color:${isStored ? '#10B981' : '#EF4444'}">
                ${isStored ? '✓ Saved to Firestore (contact_messages)' : `✗ Save Failed: ${storeErrorMsg}`}
              </td>
            </tr>
          </table>

          <div style="font-size: 13px; color: #C19A6B; font-weight: bold; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Message Content:</div>
          <div class="msg-box">${message}</div>

          <div class="footer">
            Generated automatically via secure Next.js contact route API.<br>
            © ${new Date().getFullYear()} KalaKasturi Fine Arts Gallery.
          </div>
        </div>
      </body>
      </html>
    `;

    // Render HTML Confirmation for the Customer
    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Thank You for Contacting KalaKasturi</title>
        <style>
          body { font-family: 'Georgia', serif; background-color: #0A0A0A; color: #E2E2E2; margin: 0; padding: 25px; line-height: 1.7; }
          .container { max-width: 600px; margin: 0 auto; background-color: #0F0F0F; border: 1px solid #C19A6B; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { text-align: center; border-bottom: 1px solid rgba(193, 154, 107, 0.15); padding-bottom: 25px; margin-bottom: 30px; }
          .logo { font-size: 26px; font-weight: bold; color: #FFFFFF; letter-spacing: 3px; }
          .gold-text { color: #C19A6B; }
          .cursive-brand { font-family: 'Brush Script MT', cursive, serif; font-size: 32px; color: #C19A6B; display: block; margin-top: 5px; }
          .salutation { font-size: 18px; color: #FFFFFF; margin-bottom: 20px; }
          .content-text { font-size: 15px; color: #CCCCCC; margin-bottom: 25px; font-weight: 300; }
          .highlight-note { border-left: 2px solid #C19A6B; padding-left: 15px; font-style: italic; color: #B3B3B3; margin: 25px 0; font-size: 14px; }
          .signature { margin-top: 40px; padding-top: 25px; border-top: 1px solid rgba(193, 154, 107, 0.1); }
          .artist-name { font-size: 18px; color: #FFFFFF; margin: 0; }
          .artist-title { font-size: 12px; color: #C19A6B; text-transform: uppercase; letter-spacing: 1px; margin: 2px 0 0 0; }
          .footer { text-align: center; font-size: 11px; font-family: 'Helvetica Neue', Arial, sans-serif; color: #666; margin-top: 35px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">KALA <span class="gold-text">KASTURI</span></div>
            <div class="cursive-brand">Art Gallery &amp; Studio</div>
          </div>
          
          <div class="salutation">Dear ${name},</div>
          
          <div class="content-text">
            Thank you for reaching out to KalaKasturi Fine Arts. We have successfully received your inquiry regarding <strong>"${humanSubject}"</strong>.
          </div>

          <div class="content-text">
            Every query represents an honored connection to our studio, whether you are checking the curation status of a particular canvas masterpiece, requesting updates on your custom commission, or asking for private courier transit specifications.
          </div>

          <div class="highlight-note">
            "Classical Indian realism bridges narration and precision. Every brushstroke is cured and reinforced under Rishikesh's calm winds so original oil works survive generational spans."
          </div>

          <div class="content-text">
            Our support and administrative desk are actively analyzing your details. We will formulate a tailored response and contact you within the next <strong>24–48 hours</strong>.
          </div>

          <div class="content-text">
            If you need urgent assistance in the meantime, feel free to respond directly to this email or contact us immediately at <a href="mailto:care.kalakasturi@gmail.com" style="color: #C19A6B; text-decoration: none;">care.kalakasturi@gmail.com</a>.
          </div>

          <div class="signature">
            <p class="artist-name">KalaKasturi Support Team</p>
            <p class="artist-title">Art Curations &amp; Global Logistics</p>
          </div>

          <div class="footer">
            Rishikesh, Uttarakhand, India • Original Fine Art &amp; Limited Prints<br>
            You received this email because you submitted a query at kalakasturi.vercel.app/contact.
          </div>
        </div>
      </body>
      </html>
    `;

    // 5. Dispatch Emails
    let adminMailSent = false;
    let customerMailSent = false;
    let etherealUrl = null;

    try {
      // Dispatch alert to Admin
      const adminResult = await transporter.sendMail({
        from: emailSender,
        to: adminInbox,
        subject: `🚨 [Contact Form] Inquiry from ${name}: ${humanSubject}`,
        html: adminHtml,
        replyTo: email
      });
      adminMailSent = !!adminResult.messageId;

      // Dispatch auto-responder to Customer
      const customerResult = await transporter.sendMail({
        from: emailSender,
        to: email.trim(),
        subject: `Thank you for contacting KalaKasturi Art Gallery`,
        html: customerHtml
      });
      customerMailSent = !!customerResult.messageId;

      if (isMock && testAccount) {
        etherealUrl = nodemailer.getTestMessageUrl(customerResult) || null;
        console.log("Mock Contact Emails sent successfully! Ethereal URL:", etherealUrl);
      }
    } catch (mailErr) {
      console.error("Contact email delivery failed:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Message Sent",
      dbSaved: isStored,
      adminMailSent,
      customerMailSent,
      isMock,
      etherealUrl
    });

  } catch (err: any) {
    console.error("Critical error in /api/contact Route Handler:", err);
    return NextResponse.json({
      success: false,
      message: "Internal server error. Please try again or email care.kalakasturi@gmail.com directly."
    }, { status: 500 });
  }
}
