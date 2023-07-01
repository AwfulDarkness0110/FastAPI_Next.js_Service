import smtplib, os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from dotenv.main import load_dotenv

load_dotenv()

sender_email = "davidcross66u@gmail.com"
password = "dqqthkvcreynwhmn"

# Create message container
message = MIMEMultipart("alternative")
message["From"] = sender_email


async def send_verify_email_with_link(receiver_email, verification_token):
    message["Subject"] = "System Account Verification"
    message["To"] = receiver_email

    # generate link url with verification_token
    link_url = str(os.environ["BACKEND_API"]) + verification_token

    # Create the HTML content
    html = f"""
    <html>
        <body>
            <p>Hello,<br>
                This is an example email with a link button.<br>
                Please click the button below to visit our website.<br>
            </p>
            <p>
                <a href="{link_url}">
                    <button style="background-color: #008CBA; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
                        Verify Account
                    </button>
                </a>
            </p>
        </body>
    </html>
    """
    # Attach the HTML content to the email
    message.attach(MIMEText(html, "html"))
    # Connect to the SMTP server
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())


async def send_verification_success_email(receiver_email):
    message["Subject"] = "System Account Verification"
    message["To"] = receiver_email

    # Create the HTML content
    html = f"""
    <html>
        <body>
            <p>Hello,<br>
                Successfully!<br>
            </p>
        </body>
    </html>
    """
    # Attach the HTML content to the email
    message.attach(MIMEText(html, "html"))
    # Connect to the SMTP server
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())


# Usage example
# sender_email = "davidcross66u@gmail.com"
# receiver_email = "markgarner337@gmail.com"
# subject = "Example Email with Link Button"
# link_text = "Visit Website"
# link_url = "https://www.example.com"
# send_email_with_link(sender_email, receiver_email, subject, link_text, link_url)
