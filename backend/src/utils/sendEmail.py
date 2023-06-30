# libraries to be imported
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# instance of MIMEMultipart
msg = MIMEMultipart()

# storing the sender's email address
msg["From"] = "ln9443953@gmail.com"

# storing the receiver's email address
msg["To"] = "markgarner337@gmail.com"

# storing the subject
msg["Subject"] = "Email using Python"

# Store the body of the mail
message = "Scaler Topics"

# attach the body with the msg instance
msg.attach(MIMEText(message))

# creates SMTP session
mailserver = smtplib.SMTP("smtp.gmail.com", 587)

# identify ourselves to smtp gmail client
mailserver.ehlo()

# secure our email with tls encryption
mailserver.starttls()

# re-identify ourselves as an encrypted connection
mailserver.ehlo()

# Authentication
mailserver.login("ln9443953@gmail.com", "D@rkness1122")

mailserver.sendmail("ln9443953@gmail.com", "markgarner337@gmail.com", msg.as_string())

mailserver.quit()
