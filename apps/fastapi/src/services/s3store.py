import os, boto3, uuid
from typing import Dict

def put_object_bytes(data: bytes, filename: str) -> Dict:
    endpoint = os.getenv("S3_ENDPOINT")
    region = os.getenv("S3_REGION","us-east-1")
    bucket = os.getenv("S3_BUCKET","kraft-docs")
    s3 = boto3.client("s3", endpoint_url=endpoint, region_name=region)
    # Ensure bucket exists (useful for LocalStack/dev)
    try:
        s3.head_bucket(Bucket=bucket)
    except Exception:
        create_kwargs = {"Bucket": bucket}
        # us-east-1 does not require LocationConstraint
        if region and region != "us-east-1":
            create_kwargs["CreateBucketConfiguration"] = {"LocationConstraint": region}
        try:
            s3.create_bucket(**create_kwargs)
        except Exception:
            # Race condition or permissions issue can be ignored if bucket appears after
            try:
                s3.head_bucket(Bucket=bucket)
            except Exception as e:
                raise e
    key = f"uploads/{uuid.uuid4().hex}/{filename}"
    s3.put_object(Bucket=bucket, Key=key, Body=data)
    return {"bucket": bucket, "key": key}
