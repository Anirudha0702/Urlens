import base64
from typing import Any, Dict, Literal

from brevo import AsyncBrevo
from brevo.core.api_error import ApiError
from brevo.transactional_emails import (
    SendTransacEmailRequestSender,
    SendTransacEmailRequestToItem,
)

from ...config.config import settings
from ...core.templates.verify_template import get_verify_email_template
from ...utils.exceptions import InternelServerException, LargePayloadException


class EmailService:
    def __init__(self):
        self.sender = settings.EMAIL
        self.sender_name = "Urlens"
        self.MAX_FILE_SIZE = 5 * 1024 * 1024

        self.mailer = AsyncBrevo(
            api_key=settings.BREVO_API_KEY
        )

    async def send_email(
        self,
        receiver: str,
        type: Literal["verify", "forget", "report", "ack"],
        data: Dict[str, Any],
        file_bytes: bytes | None = None,
        filename: str | None = None,
        content_type: str | None = None,
    ) -> bool:

        try:
            templates = {
                "verify": (
                    lambda d: get_verify_email_template(
                        d["username"],
                        d["otp"],
                    ),
                    "Your verification OTP",
                ),
            }

            # Get email template
            if type not in templates:
                html_content = "<div>Type not implemented</div>"
                subject = "Unknown"
            else:
                template_func, subject = templates[type]
                html_content = template_func(data)

            # Prepare attachments
            attachments = []

            if file_bytes and filename:
                if len(file_bytes) > self.MAX_FILE_SIZE:
                    raise LargePayloadException(
                        "Attachment size exceeds the maximum limit of 5MB."
                    )

                encoded_file = base64.b64encode(file_bytes).decode("utf-8")

                attachments.append({
                    "content": encoded_file,
                    "name": filename,
                })

            # Prepare sender
            sender = SendTransacEmailRequestSender(
                name=self.sender_name,
                email=self.sender,
            )

            # Prepare receiver
            to = [
                SendTransacEmailRequestToItem(
                    email=receiver,
                )
            ]

            # Send email
            await self.mailer.transactional_emails.send_transac_email(
                sender=sender,
                to=to,
                subject=subject,
                html_content=html_content,
                attachment=attachments if attachments else None,
            )

            return True

        except ApiError as e:
            raise InternelServerException(str(e))