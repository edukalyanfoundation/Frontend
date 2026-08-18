const BREVO_SENDER = {
  name: 'Edukalyan Foundation',
  email: 'edukalyanfoundation@gmail.com',
};

const OFFICIAL_REPLY_TO = 'edukalyanfoundation@gmail.com';

/**
 * Send Welcome & Registration Confirmation Email to Student
 */
export const sendWelcomeEmail = async (fullName: string, userEmail: string, sectorName?: string) => {
  const brevoApiKey = (import.meta.env.VITE_BREVO_API_KEY || '').trim();
  const resendApiKey = (import.meta.env.VITE_RESEND_API_KEY || '').trim();

  if (!userEmail) {
    console.warn('[Email Service]: No email provided for student.');
    return;
  }

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 26px; font-weight: 900;">Edukalyan Foundation</h1>
        <p style="color: #059669; font-size: 13px; margin-top: 6px; font-weight: bold; text-transform: uppercase;">Official Practical Internship Program</p>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 24px;" />
      
      <h3 style="color: #1e293b; font-size: 18px; margin-bottom: 12px;">Dear ${fullName},</h3>
      
      <p style="font-size: 14px; color: #334155; line-height: 1.6;">
        Congratulations! Your student registration for the <strong>Practical Internship Program</strong>${sectorName ? ` in <strong>${sectorName}</strong>` : ''} has been successfully submitted and confirmed by Edukalyan Foundation.
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #4f46e5; font-size: 14px;">Registration Details Summary:</h4>
        <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 13px; line-height: 1.8;">
          <li><strong>Candidate Name:</strong> ${fullName}</li>
          <li><strong>Registered Email:</strong> ${userEmail}</li>
          ${sectorName ? `<li><strong>Enrolled Sector:</strong> ${sectorName}</li>` : ''}
          <li><strong>Program Status:</strong> Active Candidate Profile</li>
          <li><strong>Verification Portal:</strong> <a href="https://www.edukalyan.org/verify-certificate" style="color: #4f46e5;">edukalyan.org/verify-certificate</a></li>
        </ul>
      </div>

      <p style="font-size: 14px; color: #334155; line-height: 1.6;">
        You can now log in to your Student Dashboard to access your personalized course sub-page, 8-week curriculum roadmap, live class sessions, and practical assignments.
      </p>

      <div style="margin: 28px 0; text-align: center;">
        <a href="https://edukalyanfoundation.netlify.app/courses" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">Access Student Course Portal</a>
      </div>

      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-top: 28px; margin-bottom: 16px;" />
      
      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
        Edukalyan Foundation NGO • Hazaribagh & Ranchi, Jharkhand<br />
        Official Portal: <a href="https://www.edukalyan.org" style="color: #4f46e5;">www.edukalyan.org</a> | Contact: <a href="mailto:edukalyanfoundation@gmail.com" style="color: #4f46e5;">edukalyanfoundation@gmail.com</a>
      </p>
    </div>
  `;

  // 1. Try sending via Brevo Transactional Email API (Primary - 300 free emails/day to any inbox)
  if (brevoApiKey) {
    try {
      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: BREVO_SENDER,
          to: [{ email: userEmail, name: fullName }],
          replyTo: { email: OFFICIAL_REPLY_TO, name: 'Edukalyan Foundation' },
          subject: 'Welcome to Edukalyan Foundation - Internship Registration Confirmed',
          htmlContent: emailHtml,
        }),
      });

      const brevoData = await brevoRes.json();
      if (brevoRes.ok) {
        console.log('[Brevo Email Success]: Welcome email delivered to', userEmail, brevoData);
        return brevoData;
      } else {
        console.warn('[Brevo Email Warning]:', brevoData);
      }
    } catch (brevoErr) {
      console.warn('[Brevo Email Connection Error]:', brevoErr);
    }
  }

  // 2. Fallback to Resend API if Resend API key is provided
  if (resendApiKey) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'Edukalyan Foundation <onboarding@resend.dev>',
          reply_to: OFFICIAL_REPLY_TO,
          to: [userEmail],
          subject: 'Welcome to Edukalyan Foundation - Internship Registration Confirmed',
          html: emailHtml,
        }),
      });

      const resendData = await resendRes.json();
      if (resendRes.ok) {
        console.log('[Resend Email Success]: Welcome email sent to', userEmail, resendData);
      } else {
        console.warn('[Resend Sandbox Notice]:', resendData);
      }
      return resendData;
    } catch (resendErr) {
      console.warn('[Resend Error]:', resendErr);
    }
  }

  console.info('[Email Notice]: Add VITE_BREVO_API_KEY in your .env or Netlify settings to deliver welcome emails to student inboxes.');
};

/**
 * Send Password Reset Email
 */
export const sendPasswordResetEmail = async (userEmail: string, resetLink?: string) => {
  const brevoApiKey = (import.meta.env.VITE_BREVO_API_KEY || '').trim();
  const resendApiKey = (import.meta.env.VITE_RESEND_API_KEY || '').trim();

  if (!userEmail) return;

  const targetLink = resetLink || `${window.location.origin}/reset-password`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #4f46e5; margin: 0;">Edukalyan Foundation</h2>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Student Account Password Recovery</p>
      </div>
      
      <p style="font-size: 14px; color: #334155;">Hello,</p>
      <p style="font-size: 14px; color: #334155; line-height: 1.6;">
        We received a request to reset your password for your Edukalyan student account (<strong>${userEmail}</strong>).
      </p>

      <div style="margin: 24px 0; text-align: center;">
        <a href="${targetLink}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 24px; font-weight: bold; font-size: 14px; display: inline-block;">Reset Your Password</a>
      </div>

      <p style="font-size: 12px; color: #64748b;">
        If you did not request a password reset, you can safely ignore this email.
      </p>

      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-top: 24px; margin-bottom: 12px;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center;">
        Edukalyan Foundation NGO • Contact: <a href="mailto:${OFFICIAL_REPLY_TO}" style="color: #4f46e5;">${OFFICIAL_REPLY_TO}</a>
      </p>
    </div>
  `;

  if (brevoApiKey) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: BREVO_SENDER,
          to: [{ email: userEmail }],
          replyTo: { email: OFFICIAL_REPLY_TO, name: 'Edukalyan Support' },
          subject: 'Password Reset Instructions - Edukalyan Foundation',
          htmlContent: emailHtml,
        }),
      });
      return await res.json();
    } catch {}
  }

  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'Edukalyan Foundation <onboarding@resend.dev>',
          reply_to: OFFICIAL_REPLY_TO,
          to: [userEmail],
          subject: 'Password Reset Instructions - Edukalyan Foundation',
          html: emailHtml,
        }),
      });
      return await res.json();
    } catch {}
  }
};
