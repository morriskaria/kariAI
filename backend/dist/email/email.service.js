"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let EmailService = EmailService_1 = class EmailService {
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    resend;
    emailFrom;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('RESEND_API_KEY');
        if (!apiKey || apiKey === 're_your_resend_api_key_here') {
            this.logger.warn('RESEND_API_KEY not configured. Email functionality will be disabled.');
            this.resend = null;
        }
        else {
            this.resend = new resend_1.Resend(apiKey);
        }
        this.emailFrom = this.configService.get('EMAIL_FROM') || 'KariaAI <noreply@kariaai.com>';
    }
    async sendEmail(options) {
        if (!this.resend) {
            this.logger.warn(`Email not sent (Resend not configured): ${options.subject} to ${options.to}`);
            this.logger.debug(`Would send email:\nTo: ${options.to}\nSubject: ${options.subject}\nHTML: ${options.html}`);
            return { success: false, error: 'Email service not configured' };
        }
        try {
            const result = await this.resend.emails.send({
                from: options.from || this.emailFrom,
                to: options.to,
                subject: options.subject,
                html: options.html,
            });
            this.logger.log(`Email sent successfully to ${options.to}: ${options.subject}`);
            return { success: true, messageId: result.data?.id };
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${options.to}: ${error.message}`, error.stack);
            return { success: false, error: error.message };
        }
    }
    async sendVerificationEmail(email, firstName, verificationToken) {
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
        const verificationUrl = `${frontendUrl}/auth/verify-email?token=${verificationToken}`;
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .header h1 {
              color: white;
              margin: 0;
              font-size: 28px;
            }
            .content {
              background: #ffffff;
              padding: 40px 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .button {
              display: inline-block;
              padding: 14px 32px;
              background: #0D9488;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
            }
            .button:hover {
              background: #0F766E;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
            }
            .note {
              background: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              font-size: 14px;
              color: #4b5563;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>⚡ KariaAI</h1>
          </div>
          <div class="content">
            <h2>Welcome to KariaAI, ${firstName}!</h2>
            <p>Thank you for creating an account with KariaAI. We're excited to help you automate customer interactions with AI-powered chatbots.</p>
            
            <p>To get started, please verify your email address by clicking the button below:</p>
            
            <center>
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </center>
            
            <div class="note">
              <strong>⏰ This link will expire in 24 hours.</strong><br>
              If you didn't create an account with KariaAI, you can safely ignore this email.
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #0D9488;">${verificationUrl}</p>
            
            <p>Need help? Reply to this email or visit our support page.</p>
            
            <p>Best regards,<br>The KariaAI Team</p>
          </div>
          <div class="footer">
            <p>KariaAI - Empowering Africa's Digital Economy 🚀</p>
            <p>This is an automated email. Please do not reply directly to this message.</p>
          </div>
        </body>
      </html>
    `;
        await this.sendEmail({
            to: email,
            subject: 'Verify your KariaAI account',
            html,
        });
    }
    async sendWelcomeEmail(email, firstName) {
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
        const dashboardUrl = `${frontendUrl}/dashboard`;
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .header h1 {
              color: white;
              margin: 0;
              font-size: 28px;
            }
            .content {
              background: #ffffff;
              padding: 40px 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .button {
              display: inline-block;
              padding: 14px 32px;
              background: #0D9488;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Welcome to KariaAI!</h1>
          </div>
          <div class="content">
            <h2>Your email is verified, ${firstName}!</h2>
            <p>You're all set to start building AI-powered chatbots for your business.</p>
            
            <h3>What's next?</h3>
            <ul>
              <li>🤖 Create your first chatbot</li>
              <li>⚙️ Customize system prompts and tone</li>
              <li>📊 Track conversations and analytics</li>
              <li>🚀 Deploy in under 30 minutes</li>
            </ul>
            
            <center>
              <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
            </center>
            
            <p>Need help getting started? Check out our documentation or contact our support team.</p>
            
            <p>Best regards,<br>The KariaAI Team</p>
          </div>
          <div class="footer">
            <p>KariaAI - Empowering Africa's Digital Economy 🚀</p>
          </div>
        </body>
      </html>
    `;
        await this.sendEmail({
            to: email,
            subject: 'Welcome to KariaAI! 🎉',
            html,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map