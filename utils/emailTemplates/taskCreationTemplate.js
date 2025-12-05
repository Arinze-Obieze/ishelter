/**
 * Email template for task creation notification
 * Used when a new task is created in a project
 */

export const getTaskCreationEmailTemplate = ({
  recipientName,
  projectName,
  stageName,
  taskName,
  taskCost,
  startDate,
  endDate,
  projectUrl,
  primaryColor = '#F07D00',
  secondaryColor = '#1F2937'
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Task Created - ishelter</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #4B5563;
          margin: 0;
          padding: 0;
          background-color: #f3f4f6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
          color: white;
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }
        .content {
          padding: 32px 24px;
        }
        .greeting {
          font-size: 16px;
          margin-bottom: 24px;
          font-weight: 500;
        }
        .task-details {
          background-color: #f3f4f6;
          border-left: 4px solid ${primaryColor};
          padding: 16px;
          border-radius: 4px;
          margin: 24px 0;
        }
        .task-details p {
          margin: 12px 0;
          font-size: 14px;
        }
        .detail-label {
          font-weight: 600;
          color: ${secondaryColor};
        }
        .detail-value {
          color: #4B5563;
          margin-left: 8px;
        }
        .cta-button {
          display: inline-block;
          background-color: ${primaryColor};
          color: white;
          padding: 12px 32px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          margin: 24px 0;
          font-size: 14px;
        }
        .cta-button:hover {
          background-color: #d96c00;
        }
        .footer {
          background-color: #f3f4f6;
          padding: 24px;
          text-align: center;
          font-size: 12px;
          color: #6B7280;
          border-top: 1px solid #e5e7eb;
        }
        .stage-badge {
          display: inline-block;
          background-color: ${primaryColor}20;
          color: ${primaryColor};
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .message-text {
          font-size: 14px;
          line-height: 1.6;
          color: #4B5563;
          margin: 16px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 New Task Created</h1>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hi <strong>${recipientName}</strong>,
          </div>
          
          <p class="message-text">
            A new task has been created in your project <strong>${projectName}</strong>. Here are the details:
          </p>
          
          <div class="task-details">
            <div class="stage-badge">${stageName}</div>
            
            <p>
              <span class="detail-label">Task:</span>
              <span class="detail-value">${taskName}</span>
            </p>
            
            <p>
              <span class="detail-label">Budget:</span>
              <span class="detail-value">₦${Number(taskCost).toLocaleString('en-NG')}</span>
            </p>
            
            <p>
              <span class="detail-label">Start Date:</span>
              <span class="detail-value">${startDate}</span>
            </p>
            
            <p>
              <span class="detail-label">End Date:</span>
              <span class="detail-value">${endDate}</span>
            </p>
          </div>
          
          <div style="text-align: center;">
            <a href="${projectUrl}" class="cta-button">View Project Timeline</a>
          </div>
          
          <p class="message-text">
            Please review the task details and ensure timely completion. If you have any questions, feel free to reach out.
          </p>
        </div>
        
        <div class="footer">
          <p>
            This is an automated notification from ishelter.<br>
            © ${new Date().getFullYear()} ishelter. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
