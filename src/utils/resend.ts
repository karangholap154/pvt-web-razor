import { Resend } from 'resend';

// Initialize Resend client lazily so build step won't throw if API key is missing
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 'your_resend_api_key_here') {
    console.warn('[Resend] Warning: RESEND_API_KEY is not configured in environment variables.');
    return null;
  }
  return new Resend(apiKey);
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'support@mail.privateacademy.in';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.privateacademy.in';

export interface OrderReceiptEmailPayload {
  to: string;
  customerName?: string;
  orderId: string;
  noteTitle: string;
  amount: number;
}

/**
 * Sends a purchase confirmation email when an order is verified successfully.
 */
export async function sendOrderReceiptEmail(payload: OrderReceiptEmailPayload) {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: 'Resend API key missing' };
  }

  const { to, customerName = 'Learner', orderId, noteTitle, amount } = payload;
  const replyToEmail = process.env.ADMIN_REPLY_TO_EMAIL || 'privateacademy.in@gmail.com';

  try {
    const data = await resend.emails.send({
      from: `PVT Notes <${FROM_EMAIL}>`,
      to: [to],
      replyTo: replyToEmail,
      subject: `Order Confirmation: ${noteTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #4f46e5; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Thank You for Your Purchase!</h1>
          </div>
          <div style="padding: 24px; background-color: #ffffff;">
            <p>Hi <strong>${customerName}</strong>,</p>
            <p>Your payment has been successfully processed. Here are your order details:</p>
            
            <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 4px 0;"><strong>Order ID:</strong> ${orderId}</p>
              <p style="margin: 4px 0;"><strong>Note Title:</strong> ${noteTitle}</p>
              <p style="margin: 4px 0;"><strong>Amount Paid:</strong> ₹${amount}</p>
            </div>

            <p>You can now access your purchased notes anytime directly from your dashboard.</p>
            
            <div style="text-align: center; margin-top: 24px;">
              <a href="${SITE_URL}/dashboard" 
                 style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
          </div>
          <div style="background-color: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">Private Academy Engineering &copy; ${new Date().getFullYear()}. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('[Resend] Error sending order receipt email:', error);
    return { success: false, error };
  }
}

export interface ContactFormEmailPayload {
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
}

/**
 * Sends a contact form notification to admins and acknowledgment to the user.
 */
export async function sendContactFormEmail(payload: ContactFormEmailPayload) {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: 'Resend API key missing' };
  }

  const { userName, userEmail, subject, message } = payload;
  const adminNotificationEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'privateacademy.in@gmail.com';

  try {
    // 1. Send notification to admin
    await resend.emails.send({
      from: `PVT Contact Form <${FROM_EMAIL}>`,
      to: [adminNotificationEmail],
      replyTo: userEmail,
      subject: `[Contact Form] ${subject}`,
      html: `
        <h3>New Contact Query Received</h3>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; border-left: 4px solid #4f46e5; padding: 10px;">${message}</blockquote>
      `,
    });

    // 2. Send acknowledgment to user
    await resend.emails.send({
      from: `PVT Support <${FROM_EMAIL}>`,
      to: [userEmail],
      replyTo: adminNotificationEmail,
      subject: `We received your message: ${subject}`,
      html: `
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Thank you for reaching out to us. We have received your inquiry regarding "<strong>${subject}</strong>" and our team will get back to you shortly.</p>
        <p>Best regards,<br/>PVT Support Team</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('[Resend] Error sending contact form email:', error);
    return { success: false, error };
  }
}

export interface SubmissionAlertPayload {
  contributorEmail: string;
  noteTitle: string;
  university: string;
  branch: string;
  semester: string;
}

/**
 * Sends a notification email to admins when a user submits new notes for approval.
 */
export async function sendSubmissionAlertEmail(payload: SubmissionAlertPayload) {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: 'Resend API key missing' };
  }

  const { contributorEmail, noteTitle, university, branch, semester } = payload;
  const adminNotificationEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'privateacademy.in@gmail.com';

  try {
    await resend.emails.send({
      from: `PVT Contributions <${FROM_EMAIL}>`,
      to: [adminNotificationEmail],
      subject: `[New Submission] ${noteTitle}`,
      html: `
        <h3>New Study Note Submission Pending Review</h3>
        <p><strong>Contributor Email:</strong> ${contributorEmail}</p>
        <p><strong>Title:</strong> ${noteTitle}</p>
        <p><strong>University:</strong> ${university}</p>
        <p><strong>Branch / Sem:</strong> ${branch} (Sem ${semester})</p>
        <p><a href="${SITE_URL}/admin">Click here to review in Admin Dashboard</a></p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('[Resend] Error sending submission alert email:', error);
    return { success: false, error };
  }
}

export interface ContributionStatusUpdatePayload {
  to: string;
  noteTitle: string;
  status: 'approved' | 'rejected';
  feedback?: string;
}

/**
 * Sends an email update to contributor when their note submission is approved or rejected by admin.
 */
export async function sendContributionStatusUpdateEmail(payload: ContributionStatusUpdatePayload) {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: 'Resend API key missing' };
  }

  const { to, noteTitle, status, feedback } = payload;
  const isApproved = status === 'approved';
  const replyToEmail = process.env.ADMIN_REPLY_TO_EMAIL || 'privateacademy.in@gmail.com';

  try {
    await resend.emails.send({
      from: `PVT Contributions <${FROM_EMAIL}>`,
      to: [to],
      replyTo: replyToEmail,
      subject: isApproved
        ? `🎉 Approved! Your note "${noteTitle}" is now live!`
        : `Update on your note submission "${noteTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: ${isApproved ? '#22c55e' : '#ef4444'}; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 22px;">
              ${isApproved ? 'Submission Approved & Published!' : 'Submission Status Update'}
            </h1>
          </div>
          <div style="padding: 24px; background-color: #ffffff;">
            <p>Your submitted study note "<strong>${noteTitle}</strong>" has been reviewed.</p>
            
            <div style="background-color: #f9fafb; border-left: 4px solid ${isApproved ? '#22c55e' : '#ef4444'}; padding: 16px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Status:</strong> ${isApproved ? 'Approved & Published to Live Library' : 'Not Approved'}</p>
              ${feedback ? `<p style="margin-top: 8px;"><strong>Admin Note:</strong> ${feedback}</p>` : ''}
            </div>

            ${
              isApproved
                ? `<p>Your note is now available to engineering students. You can track downloads & earnings split from your profile dashboard.</p>
                   <div style="text-align: center; margin-top: 24px;">
                     <a href="${SITE_URL}/contribute" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                       View Dashboard
                     </a>
                   </div>`
                : `<p>If you have any questions or want to submit an updated version, please reply directly to this email.</p>`
            }
          </div>
          <div style="background-color: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">Private Academy Engineering &copy; ${new Date().getFullYear()}. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('[Resend] Error sending contribution status update email:', error);
    return { success: false, error };
  }
}
