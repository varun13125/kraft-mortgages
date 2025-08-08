from typing import Any

def persist_to_s3(fileobj: Any, filename: str) -> dict:
    # TODO: boto3 upload to S3 bucket
    return {"key": f"uploads/{filename}", "bucket": "kraft-docs"}
