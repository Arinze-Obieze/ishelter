/**
 * Email template for overdue task notification
 * Used when a task is overdue and still ongoing/pending
 */

export const getOverdueTaskEmailTemplate = ({
  recipientName,
  projectName,
  stageName,
  taskName,
  dueDate,
  taskCost,
  daysOverdue,
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
      <title>Overdue Task Alert - ishelter</title>
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
          background: linear-gradient(135deg, #d32f2f, #b71c1c);
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
        .alert-banner {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 16px;
          border-radius: 4px;
          margin: 24px 0;
        }
        .alert-banner p {
          margin: 8px 0;
          font-size: 14px;
          color: #856404;
        }
        .task-details {
          background-color: #f3f4f6;
          border-left: 4px solid #d32f2f;
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
          background-color: #d32f2f;
          color: white;
          padding: 12px 32px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          margin: 24px 0;
          font-size: 14px;
        }
        .cta-button:hover {
          background-color: #b71c1c;
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
          background-color: #d32f2f20;
          color: #d32f2f;
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
        .overdue-badge {
          display: inline-block;
          background-color: #d32f2f;
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 12px;
          margin-left: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Task Overdue Alert</h1>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hi <strong>${recipientName}</strong>,
          </div>
          
          <div class="alert-banner">
            <p>
              <strong>⚠️ URGENT:</strong> A task in project <strong>${projectName}</strong> is overdue by <strong>${daysOverdue} day${daysOverdue > 1 ? 's' : ''}</strong> and requires immediate attention.
            </p>
          </div>
          
          <div class="task-details">
            <div class="stage-badge">${stageName}</div>
            
            <p>
              <span class="detail-label">Task:</span>
              <span class="detail-value">${taskName}</span>
              <span class="overdue-badge">OVERDUE</span>
            </p>
            
            <p>
              <span class="detail-label">Was Due:</span>
              <span class="detail-value">${dueDate}</span>
            </p>
            
            <p>
              <span class="detail-label">Budget:</span>
              <span class="detail-value">₦${Number(taskCost).toLocaleString('en-NG')}</span>
            </p>
          </div>
          
          <p class="message-text">
            Please take immediate action to complete this task or provide an update on the current status. Delays may impact the overall project timeline and budget.
          </p>
          
          <div style="text-align: center;">
            <a href="${projectUrl}" class="cta-button">View & Update Task</a>
          </div>
          
          <p class="message-text">
            If you have completed this task or need to adjust the timeline, please update the project status immediately.
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
