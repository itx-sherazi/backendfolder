export const Verification_Email_Template = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      border: 1px solid #ddd;
    }
    .header {
      background-color: #4CAF50;
      color: white;
      padding: 20px;
      text-align: center;
      font-size: 26px;
      font-weight: bold;
    }
    .content {
      padding: 25px;
      color: #333;
      line-height: 1.8;
    }
    .footer {
      background-color: #f4f4f4;
      padding: 15px;
      text-align: center;
      color: #777;
      font-size: 12px;
      border-top: 1px solid #ddd;
    }
    p {
      margin: 0 0 15px;
    }
    .verification-link {
      display: block;
      margin: 20px 0;
      font-size: 22px;
      color: #4CAF50;
      text-decoration: none;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .verification-link:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Verify Your Email</div>
    <div class="content">
      <p>Hello,</p>
      <p>Thank you for signing up! Please confirm your email address by clicking the link below:</p>
      <a class="verification-link" href="{verificationLink}">Click here to verify your email</a>
      <p>If you did not create an account, no further action is required.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
