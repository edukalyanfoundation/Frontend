// Testing Mode: Uses Resend default domain. In Production after buying domain, switch to 'Edukalyan Foundation <noreply@yourdomain.com>'
const SENDER_EMAIL = 'Edukalyan Foundation <onboarding@resend.dev>';
const OFFICIAL_REPLY_TO = 'edukalyanfoundation@gmail.com';

export const sendWelcomeEmail = async (fullName: string, userEmail: string) => {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY || '';

  if (!userEmail) {
    console.warn('[Resend Email]: No email provided for student.');
    return;
  }

  try {
    // 1. Send Welcome Email to Candidate Student
    const userRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        reply_to: OFFICIAL_REPLY_TO,
        to: [userEmail],
        subject: `Welcome to Edukalyan Foundation - UGC Internship Registration Confirmed`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #4f46e5; margin: 0; font-size: 26px; font-weight: 900;">Edukalyan Foundation</h1>
              <p style="color: #059669; font-size: 13px; margin-top: 6px; font-weight: bold; text-transform: uppercase;">Official UGC Mandated Internship Program</p>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 24px;" />
            
            <h3 style="color: #1e293b; font-size: 18px; margin-bottom: 12px;">Dear ${fullName},</h3>
            
            <p style="font-size: 14px; color: #334155; line-height: 1.6;">
              Congratulations! Your student registration for the <strong>UGC Mandated Practical Internship Program</strong> has been successfully submitted and verified by Edukalyan Foundation.
            </p>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #4f46e5; font-size: 14px;">Registration Details Summary:</h4>
              <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 13px; line-height: 1.8;">
                <li><strong>Candidate Name:</strong> ${fullName}</li>
                <li><strong>Registered Email:</strong> ${userEmail}</li>
                <li><strong>Program Status:</strong> Active Candidate Profile</li>
                <li><strong>Verification Portal:</strong> <a href="https://www.edukalyan.org/verify-certificate" style="color: #4f46e5;">edukalyan.org/verify-certificate</a></li>
              </ul>
            </div>

            <p style="font-size: 14px; color: #334155; line-height: 1.6;">
              Our academic guidance desk will update your portal dashboard with project documentation, attendance logs, and university credit verification details.
            </p>

            <div style="margin: 28px 0; text-align: center;">
              <a href="http://localhost:5173/dashboard/profile" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">Access Student Dashboard</a>
            </div>

            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-top: 28px; margin-bottom: 16px;" />
            
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
              Edukalyan Foundation NGO • Hazaribagh & Ranchi, Jharkhand<br />
              Official Portal: <a href="https://www.edukalyan.org" style="color: #4f46e5;">www.edukalyan.org</a> | Contact: <a href="mailto:edukalyanfoundation@gmail.com" style="color: #4f46e5;">edukalyanfoundation@gmail.com</a>
            </p>
          </div>
        `,
      }),
    });

    const userEmailData = await userRes.json();

    if (!userRes.ok) {
      console.warn('[Resend API Warning]:', userEmailData);
      if (userEmailData.message && userEmailData.message.includes('only send to your own email address')) {
        console.info('[Resend Testing Notice]: On Resend free tier onboarding@resend.dev, emails can only be delivered to your registered Resend account email address. To deliver emails to all public user emails, verify your custom domain in the Resend Dashboard (https://resend.com/domains).');
      }
    } else {
      console.log('[Resend Success]: Welcome email sent to', userEmail, userEmailData);
    }

    // 2. Send Admin Copy Notification to Organization Desk
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        reply_to: userEmail,
        to: [OFFICIAL_REPLY_TO],
        subject: `[New Registration Alert] ${fullName} (${userEmail})`,
        html: `<p>New student candidate <strong>${fullName}</strong> (${userEmail}) has completed UGC registration.</p>`,
      }),
    }).catch(() => {});

    return userEmailData;
  } catch (err) {
    console.error('[Resend Error]: Failed to send welcome email:', err);
  }
};

export const sendPasswordResetEmail = async (userEmail: string, resetLink?: string) => {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY || '';

  if (!userEmail) return;

  const targetLink = resetLink || `${window.location.origin}/reset-password`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        reply_to: OFFICIAL_REPLY_TO,
        to: [userEmail],
        subject: `Password Reset Instructions - Edukalyan Foundation`,
        html: `
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
        `,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.warn('[Resend Password Reset Warning]:', data);
    } else {
      console.log('[Resend Success]: Password reset email sent to', userEmail, data);
    }
    return data;
  } catch (err) {
    console.error('[Resend Error]: Failed to send password reset email:', err);
  }
};
