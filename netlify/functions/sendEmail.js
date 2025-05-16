const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, position, email, phone, message, attachment } = data;

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'devanshrajput032006@gmail.com',       // Your Gmail address
        pass: 'xxiv rath uxon rjeh',          // Use Gmail app password
      },
    });

    // Email to your company (InfyPlus)
    const mailToCompany = {
      from: `"${name}" <${email}>`,
      to: 'infyplusconsulting@gmail.com',
      subject: `New Job Application: ${name} - ${position}`,
      text: `
Name: ${name}
Position: ${position}
Email: ${email}
Phone: ${phone}
Message: ${message}
      `,
      attachments: [],
    };

    if (attachment) {
      mailToCompany.attachments.push({
        filename: attachment.filename,
        content: attachment.content,
        encoding: 'base64',
      });
    }

    // Auto-reply email to applicant
    const mailToApplicant = {
  from: '"InfyPlus Consulting" <infyplusconsulting@gmail.com>',
  to: email,
  subject: 'Thank you for your job application!',
  html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <img src="https://infyplus.com/assets/images/logo.png" alt="InfyPlus Consulting" style="width:150px; margin-bottom:20px; padding:10px; background-color:#000;" />
      <h2>Hello ${name},</h2>
      <p>Thank you for reaching out to us regarding the <strong>${position}</strong> position. We have successfully received your application and our team will review it within the next 24-48 hours.</p>

      <h3>Your Application Details:</h3>
      <p>
        <strong>Job Position:</strong> ${position} <br/>
        <strong>Email:</strong> ${email} <br/>
        <strong>Phone:</strong> ${phone} <br/>
        <strong>Message:</strong> ${message}
      </p>

      <p>If your qualifications align with our requirements, we will contact you for further steps. Meanwhile, if you have any urgent inquiries, feel free to reach us at <a href="mailto:infyplusconsulting@gmail.com">infyplusconsulting@gmail.com</a>.</p>

      <br/>
      <p>||Thank you for considering InfyPlus Consulting as your next career move!||</p>

      <br/>
      <p style="text-align: center;">Best Regards,<br/>InfyPlus Consulting Team</p>
    </div>
  `,
};


    // Send both emails in parallel
    await Promise.all([
      transporter.sendMail(mailToCompany),
      transporter.sendMail(mailToApplicant),
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Application sent and confirmation email dispatched!' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send emails' }),
    };
}
};
