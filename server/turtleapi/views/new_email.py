import os
import imaplib
import email
from email.header import decode_header
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response


class NewEmails(ViewSet):
    def list(self, request):
        # connect to email server (IMAP)
        mail = imaplib.IMAP4_SSL('imap.gmail.com')
        mail.login(os.getenv('EMAIL_HOST_USER'), os.getenv('EMAIL_HOST_PASSWORD'))

        # select inbox
        mail.select('inbox')

        # search for new emails
        status, data = mail.search(None, '(UNSEEN SUBJECT "Turtle:*")')

        new_emails = []
        # fetch new emails
        for mail_id in data[0].split():
            status, data = mail.fetch(mail_id, '(BODY.PEEK[])')
            raw_email = data[0][1]

            # parse email message
            email_message = email.message_from_bytes(raw_email)

            # get subject, sender, and body
            subject, encoding = decode_header(email_message['Subject'])[0]
            sender, encoding = decode_header(email_message['From'])[0]
            body = email_message.get_payload(decode=True).decode(
                'utf-8'
            )  # decode body to string

            # replace line break characters
            body = body.replace('\r\n', ', ')  # replace `\r\n` with `, `

            if 'Turtle:' in subject and subject.split('Turtle:')[1]:
                new_emails.append({'subject': subject, 'sender': sender, 'body': body})

        # close connection
        mail.close()
        mail.logout()

        # return new emails
        return Response(new_emails)
