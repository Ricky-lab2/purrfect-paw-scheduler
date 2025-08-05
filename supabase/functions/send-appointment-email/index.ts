import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AppointmentEmailRequest {
  ownerName: string;
  email: string;
  petName: string;
  service: string;
  date: string;
  timeSlot: string;
  diagnosis?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    console.log("Received appointment email request");
    
    const {
      ownerName,
      email,
      petName,
      service,
      date,
      timeSlot,
      diagnosis,
    }: AppointmentEmailRequest = await req.json();

    console.log("Processing appointment email for:", { ownerName, email, petName });

    // Format the date for better readability
    const appointmentDate = new Date(date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailResponse = await resend.emails.send({
      from: "PetCare Clinic <onboarding@resend.dev>",
      to: [email],
      subject: `Appointment Confirmation - ${petName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Appointment Confirmation</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f8fafc; padding: 30px; }
              .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
              .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
              .label { font-weight: bold; color: #374151; }
              .value { color: #6b7280; }
              .footer { background: #374151; color: #d1d5db; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
              .important { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🐾 Appointment Confirmed!</h1>
                <p>Your pet's appointment has been successfully scheduled</p>
              </div>
              
              <div class="content">
                <p>Dear <strong>${ownerName}</strong>,</p>
                
                <p>Thank you for booking an appointment with PetCare Clinic. We're excited to take care of <strong>${petName}</strong>!</p>
                
                <div class="appointment-details">
                  <h3>📅 Appointment Details</h3>
                  <div class="detail-row">
                    <span class="label">Pet Name:</span>
                    <span class="value">${petName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Service:</span>
                    <span class="value">${service}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Date:</span>
                    <span class="value">${formattedDate}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Time:</span>
                    <span class="value">${timeSlot}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Owner:</span>
                    <span class="value">${ownerName}</span>
                  </div>
                  ${diagnosis ? `
                  <div class="detail-row">
                    <span class="label">Reason for Visit:</span>
                    <span class="value">${diagnosis}</span>
                  </div>
                  ` : ''}
                </div>
                
                <div class="important">
                  <h4>🔔 Important Reminders:</h4>
                  <ul>
                    <li>Please arrive 10 minutes early for check-in</li>
                    <li>Bring any previous medical records or medications</li>
                    <li>If you need to reschedule, please call us at least 24 hours in advance</li>
                    <li>Ensure your pet is secure in a carrier or on a leash</li>
                  </ul>
                </div>
                
                <p>If you have any questions or need to make changes to your appointment, please don't hesitate to contact us.</p>
                
                <p>We look forward to seeing you and ${petName} soon!</p>
                
                <p>Best regards,<br>
                <strong>The PetCare Clinic Team</strong></p>
              </div>
              
              <div class="footer">
                <p>📞 Contact us: (555) 123-4567 | 📧 info@petcareclinic.com</p>
                <p>📍 123 Pet Street, Animal City, AC 12345</p>
                <p style="font-size: 12px; margin-top: 15px;">
                  This is an automated message. Please do not reply to this email.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-appointment-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);