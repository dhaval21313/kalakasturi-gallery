import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import nodemailer from 'nodemailer';

// Validation Patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s()+-]{8,20}$/;

// Allowed fields list for verification validation
const ALLOWED_COURSES = [
  'Drawing & Sketching',
  'Watercolor Painting',
  'Acrylic Painting',
  'Oil Painting',
  'Mixed Media',
  'One-on-One Art Classes',
  'Not Sure Yet'
];

const ALLOWED_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const ALLOWED_MODES = ['Online', 'In-Person', 'Either'];

// Node transporter setup with automatic Ethereal email fallback for zero-config dev running
const getTransporter = async () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465');
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Guard: use mock Ethereal transporter if standard credentials are empty or placeholders
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
            console.log("SIMULATED MAIL DISPATCH (No active SMTP):", mailOptions.subject);
            return { messageId: 'simulated-msg-id-1000' };
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
      fullName,
      email,
      phone,
      age,
      course,
      experienceLevel,
      learningMode,
      preferredDays,
      goal,
      howHeard,
      language = 'en',
      website // Honeypot Field
    } = body;

    // 1. Honeypot Spam Bot Filter
    // If the hidden 'website' field contains a value, reject it as a bot submission.
    // Return a simulated 200 OK success to confuse the script, but do not process or store.
    if (website && website.trim() !== '') {
      console.warn("Spambot activity detected via honeypot. Ignoring submission.");
      return NextResponse.json({
        success: true,
        message: language === 'hi' 
          ? "धन्यवाद! आपकी पूछताछ प्राप्त हो गई है। हम 24–48 घंटों के भीतर आपसे संपर्क करेंगे।" 
          : "Thank you! We will contact you within 24-48 hours.",
        spamBlocked: true
      });
    }

    // 2. Server-side Input Validation
    const errors: string[] = [];

    if (!fullName || fullName.trim().length < 2) {
      errors.push("Full Name must be at least 2 characters.");
    }
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      errors.push("Please provide a valid email address.");
    }
    if (!phone || !PHONE_REGEX.test(phone.trim())) {
      errors.push("Please provide a valid phone number (8 to 20 digits, spaces/hyphens allowed).");
    }
    if (!course || !ALLOWED_COURSES.includes(course)) {
      errors.push("Please select a valid course from our official curriculum.");
    }
    if (!experienceLevel || !ALLOWED_LEVELS.includes(experienceLevel)) {
      errors.push("Please select a valid experience level.");
    }
    if (!learningMode || !ALLOWED_MODES.includes(learningMode)) {
      errors.push("Please select a valid learning mode.");
    }

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        message: errors.join(" ")
      }, { status: 400 });
    }

    // 3. Database Persistence (Firestore)
    let isStored = false;
    let storeErrorMsg = "";

    try {
      if (db) {
        await addDoc(collection(db, "course_inquiries"), {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          age: age ? parseInt(age.toString()) : null,
          course,
          experienceLevel,
          learningMode,
          preferredDays: preferredDays ? preferredDays.trim() : null,
          goal: goal ? goal.trim() : null,
          howHeard: howHeard || null,
          submittedAt: serverTimestamp(),
          language,
          serverProcessed: true
        });
        isStored = true;
      } else {
        console.warn("Firestore database initialization failed. Local caching is advised.");
        storeErrorMsg = "Database connection offline.";
      }
    } catch (dbErr: any) {
      console.error("Error writing inquiry to Firestore:", dbErr);
      storeErrorMsg = dbErr.message || "Failed to persist to database.";
    }

    // 4. Email Transporter Initialization
    const { transporter, isMock, testAccount } = await getTransporter();
    const adminInbox = process.env.ADMIN_EMAIL || 'care.kalakasturi@gmail.com';
    const emailSender = process.env.SMTP_FROM || '"KalaKasturi Art Academy" <care.kalakasturi@gmail.com>';

    // Render HTML Lead Alert for the Admin
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Course Inquiry - KalaKasturi</title>
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
          .goal-box { background-color: rgba(255, 255, 255, 0.02); border-left: 3px solid #C19A6B; padding: 15px; border-radius: 4px; font-style: italic; color: #D4D4D4; line-height: 1.6; }
          .footer { text-align: center; font-size: 11px; color: #666; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 15px; margin-top: 25px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">KALA <span class="gold-accent">KASTURI</span></div>
            <div class="title">New Art Academy Enrollment Inquiry</div>
          </div>
          
          <table class="details-table">
            <tr>
              <td class="label">Student Name</td>
              <td class="value">${fullName}</td>
            </tr>
            <tr>
              <td class="label">Email Address</td>
              <td class="value"><a href="mailto:${email}" style="color:#C19A6B; text-decoration:none;">${email}</a></td>
            </tr>
            <tr>
              <td class="label">Phone / WhatsApp</td>
              <td class="value">${phone}</td>
            </tr>
            <tr>
              <td class="label">Age</td>
              <td class="value">${age || 'Not Specified'}</td>
            </tr>
            <tr>
              <td class="label">Selected Course</td>
              <td class="value" style="font-weight:bold; color:#FFFFFF;">${course}</td>
            </tr>
            <tr>
              <td class="label">Experience Level</td>
              <td class="value">${experienceLevel}</td>
            </tr>
            <tr>
              <td class="label">Learning Mode</td>
              <td class="value">${learningMode}</td>
            </tr>
            <tr>
              <td class="label">Preferred Schedule</td>
              <td class="value">${preferredDays || 'Not Specified'}</td>
            </tr>
            <tr>
              <td class="label">Referral Source</td>
              <td class="value">${howHeard || 'Not Specified'}</td>
            </tr>
            <tr>
              <td class="label">System Status</td>
              <td class="value" style="font-size:12px; color:${isStored ? '#10B981' : '#EF4444'}">
                ${isStored ? '✓ Saved to Firestore (course_inquiries)' : `✗ Save Failed: ${storeErrorMsg}`}
              </td>
            </tr>
          </table>

          ${goal ? `
            <div style="font-size: 13px; color: #C19A6B; font-weight: bold; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Creative Aspirations & Goals:</div>
            <div class="goal-box">"${goal}"</div>
          ` : ''}

          <div class="footer">
            Generated automatically via secure Next.js route API.<br>
            © ${new Date().getFullYear()} KalaKasturi Fine Arts Academy.
          </div>
        </div>
      </body>
      </html>
    `;

    // Render HTML Student Auto-Responder
    // Styled in a beautiful, professional, high-fidelity format matching the luxury gallery
    const studentEnglishHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>A Journey in Color - Inquiry Received</title>
        <style>
          body { font-family: 'Georgia', serif; background-color: #0A0A0A; color: #E2E2E2; margin: 0; padding: 25px; line-height: 1.7; }
          .container { max-width: 600px; margin: 0 auto; background-color: #0F0F0F; border: 1px solid #C19A6B; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { text-align: center; border-bottom: 1px solid rgba(193, 154, 107, 0.15); padding-bottom: 25px; margin-bottom: 30px; }
          .logo { font-size: 26px; font-weight: bold; color: #FFFFFF; letter-spacing: 3px; font-style: normal; }
          .gold-text { color: #C19A6B; }
          .cursive-brand { font-family: 'Brush Script MT', cursive, serif; font-size: 32px; color: #C19A6B; display: block; margin-top: 5px; }
          .salutation { font-size: 18px; color: #FFFFFF; margin-bottom: 20px; font-weight: normal; }
          .content-text { font-size: 15px; color: #CCCCCC; margin-bottom: 25px; font-weight: 300; }
          .summary-card { background-color: #141414; border: 1px solid rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 20px; margin: 25px 0; }
          .summary-title { font-size: 12px; font-family: 'Helvetica Neue', Arial, sans-serif; text-transform: uppercase; color: #C19A6B; letter-spacing: 2px; font-weight: bold; margin-bottom: 12px; border-bottom: 1px solid rgba(193, 154, 107, 0.1); padding-bottom: 6px; }
          .summary-item { font-size: 14px; margin-bottom: 8px; color: #D5D5D5; }
          .summary-item strong { color: #FFFFFF; font-weight: 500; }
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
            <div class="cursive-brand">Art Academy</div>
          </div>
          
          <div class="salutation">Dear ${fullName},</div>
          
          <div class="content-text">
            Thank you for welcoming KalaKasturi Art Academy into your creative journey. We have received your enrollment inquiry for our structured courses and are absolutely thrilled by your artistic aspirations.
          </div>

          <div class="content-text">
            Ankita and our academic team are actively reviewing your background experience and personal learning goals to ensure we match your unique vision with the absolute best class format.
          </div>

          <div class="summary-card">
            <div class="summary-title">Your Enrollment Inquiry Summary</div>
            <div class="summary-item"><strong>Academy Course:</strong> ${course}</div>
            <div class="summary-item"><strong>Experience Level:</strong> ${experienceLevel}</div>
            <div class="summary-item"><strong>Learning Mode:</strong> ${learningMode}</div>
            ${preferredDays ? `<div class="summary-item"><strong>Schedule Preference:</strong> ${preferredDays}</div>` : ''}
          </div>

          <div class="highlight-note">
            "One-on-one personal coaching classes include complete starter art supplies tailored exclusively to your chosen medium—including fine cotton canvases, professional sketching charcoals, graphite shading pencils, curated paint palettes, and primary brushes—so you can dive into color immediately."
          </div>

          <div class="content-text">
            We will review all parameters and contact you within the next <strong>24–48 hours</strong> with specific course slots, detailed curriculum options, and batch availability. In the meantime, if you have any questions, please feel free to reach out to us at <a href="mailto:care.kalakasturi@gmail.com" style="color: #C19A6B; text-decoration: none;">care.kalakasturi@gmail.com</a>.
          </div>

          <div class="signature">
            <p class="artist-name">Ankita</p>
            <p class="artist-title">Fine Artist &amp; Academy Mentor</p>
          </div>

          <div class="footer">
            Rishikesh, Uttarakhand, India • Fine Realism &amp; Metaphysical Expression<br>
            You received this email because you submitted an inquiry at kalakasturi.vercel.app.
          </div>
        </div>
      </body>
      </html>
    `;

    const studentHindiHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>कला की एक अनूठी यात्रा - पूछताछ प्राप्त हुई</title>
        <style>
          body { font-family: 'Georgia', serif; background-color: #0A0A0A; color: #E2E2E2; margin: 0; padding: 25px; line-height: 1.8; }
          .container { max-width: 600px; margin: 0 auto; background-color: #0F0F0F; border: 1px solid #C19A6B; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { text-align: center; border-bottom: 1px solid rgba(193, 154, 107, 0.15); padding-bottom: 25px; margin-bottom: 30px; }
          .logo { font-size: 26px; font-weight: bold; color: #FFFFFF; letter-spacing: 3px; }
          .gold-text { color: #C19A6B; }
          .cursive-brand { font-size: 24px; color: #C19A6B; display: block; margin-top: 5px; font-weight: normal; }
          .salutation { font-size: 18px; color: #FFFFFF; margin-bottom: 20px; }
          .content-text { font-size: 15px; color: #CCCCCC; margin-bottom: 25px; font-weight: 300; }
          .summary-card { background-color: #141414; border: 1px solid rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 20px; margin: 25px 0; }
          .summary-title { font-size: 12px; font-family: 'Helvetica Neue', Arial, sans-serif; text-transform: uppercase; color: #C19A6B; letter-spacing: 2px; font-weight: bold; margin-bottom: 12px; border-bottom: 1px solid rgba(193, 154, 107, 0.1); padding-bottom: 6px; }
          .summary-item { font-size: 14px; margin-bottom: 8px; color: #D5D5D5; }
          .summary-item strong { color: #FFFFFF; font-weight: 500; }
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
            <div class="logo">कला <span class="gold-text">कस्तूरी</span></div>
            <div class="cursive-brand">आर्ट एकेडमी</div>
          </div>
          
          <div class="salutation">प्रिय ${fullName},</div>
          
          <div class="content-text">
            कला कस्तूरी आर्ट एकेडमी के साथ अपनी रचनात्मक यात्रा की शुरुआत करने के लिए आपका बहुत-बहुत धन्यवाद। हमें आपकी चुनी हुई पाठ्यक्रम के लिए पूछताछ प्राप्त हुई है, और हम आपकी कलात्मक आकांक्षाओं को जानकर बेहद उत्साहित हैं।
          </div>

          <div class="content-text">
            अंकिता और हमारी कला टीम आपके अनुभव और व्यक्तिगत लक्ष्यों की समीक्षा कर रही है ताकि हम आपकी रचनात्मक क्षमता के अनुसार सर्वश्रेष्ठ क्लास फॉर्मेट का चयन कर सकें।
          </div>

          <div class="summary-card">
            <div class="summary-title">पूछताछ का विवरण</div>
            <div class="summary-item"><strong>एकेडमी पाठ्यक्रम:</strong> ${course}</div>
            <div class="summary-item"><strong>अनुभव स्तर:</strong> ${experienceLevel}</div>
            <div class="summary-item"><strong>लर्निंग मोड:</strong> ${learningMode}</div>
            ${preferredDays ? `<div class="summary-item"><strong>समय की प्राथमिकता:</strong> ${preferredDays}</div>` : ''}
          </div>

          <div class="highlight-note">
            "हमारी व्यक्तिगत वन-ऑन-वन कोचिंग कक्षाओं में आपके चुने हुए माध्यम के अनुकूल आवश्यक कला सामग्रियां जैसे कैनवास, ब्रश, रंग, चारकोल, ग्रेफाइट पेंसिल आदि पूरी तरह शामिल हैं—ताकि आप बिना किसी अतिरिक्त तैयारी के अपनी कला साधना शुरू कर सकें।"
          </div>

          <div class="content-text">
            हम आपकी पूछताछ के सभी मापदंडों की समीक्षा करके अगले <strong>२४ से ४८ घंटों</strong> के भीतर आपसे संपर्क करेंगे और पाठ्यक्रम स्लॉट, विस्तृत विवरण और बैच उपलब्धता की जानकारी साझा करेंगे। इस बीच, यदि आपके मन में कोई प्रश्न हो, तो कृपया हमसे <a href="mailto:care.kalakasturi@gmail.com" style="color: #C19A6B; text-decoration: none;">care.kalakasturi@gmail.com</a> पर बेझिझक संपर्क करें।
          </div>

          <div class="signature">
            <p class="artist-name">अंकिता</p>
            <p class="artist-title">कलाकार एवं एकेडमी मेंटर</p>
          </div>

          <div class="footer">
            ऋषिकेश, उत्तराखंड, भारत • फाइन रियलिज्म और आध्यात्मिक कला अभिव्यक्ति<br>
            यह ईमेल आपको इसलिए प्राप्त हुआ है क्योंकि आपने kalakasturi.vercel.app पर कला कक्षा की पूछताछ की है।
          </div>
        </div>
      </body>
      </html>
    `;

    // 5. Send Emails
    let adminMailSent = false;
    let studentMailSent = false;
    let etherealUrl = null;

    try {
      // Dispatch Lead notification to the Admin
      const adminResult = await transporter.sendMail({
        from: emailSender,
        to: adminInbox,
        subject: `🚨 [New Lead] Academy Course Inquiry: ${fullName}`,
        html: adminHtml,
        replyTo: email
      });
      adminMailSent = !!adminResult.messageId;

      // Dispatch auto-responder to the Student
      const studentSubject = language === 'hi' 
        ? "कला कस्तूरी आर्ट एकेडमी - पूछताछ प्राप्त हुई" 
        : "Welcome to KalaKasturi Art Academy - Inquiry Received";
        
      const studentResult = await transporter.sendMail({
        from: emailSender,
        to: email.trim(),
        subject: studentSubject,
        html: language === 'hi' ? studentHindiHtml : studentEnglishHtml
      });
      studentMailSent = !!studentResult.messageId;

      // If in mock test mode, retrieve preview URL for Ethereal Sandbox logs
      if (isMock && testAccount) {
        etherealUrl = nodemailer.getTestMessageUrl(studentResult) || null;
        console.log("Mock Emails sent successfully! Ethereal Preview URL:", etherealUrl);
      }
    } catch (mailErr) {
      console.error("Email delivery failed:", mailErr);
      // We do not throw here, so that if only email fails but database succeeds, we still return successful database save.
    }

    return NextResponse.json({
      success: true,
      message: language === 'hi' 
        ? "धन्यवाद! आपकी पूछताछ प्राप्त हो गई है। हम 24–48 घंटों के भीतर आपसे संपर्क करेंगे।" 
        : "Thank you! We will contact you within 24-48 hours.",
      dbSaved: isStored,
      adminMailSent,
      studentMailSent,
      isMock,
      etherealUrl
    });

  } catch (err: any) {
    console.error("Critical error in /api/inquiry Route Handler:", err);
    return NextResponse.json({
      success: false,
      message: "Internal server error. Please try again or connect via WhatsApp."
    }, { status: 500 });
  }
}
