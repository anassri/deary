import boto3
from .config import Config

# s3 credentials to be stored as env variables in a config file

s3 = boto3.client(
    "s3",
    aws_access_key_id=Config.S3_KEY,
    aws_secret_access_key=Config.S3_SECRET
)

#This function posts to aws and returns a photo url
def upload_file_to_s3(file, bucket_name, acl="public-read"):
    print('bucket and file', file, bucket_name)

    try:

        s3.upload_fileobj(
            file,
            bucket_name,
            file.filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )

    except Exception as e:
        # This is a catch all exception, edit this part to fit your needs.
        print("Something Happened: ", e)
        return e
    #Note your photo url will be different the correct url can be found in your
    #bucket when you click on an image and check the image info. 
    photoUrl = "{}{}".format(
        'https://woofr.s3-us-west-1.amazonaws.com/', file.filename)
    return photoUrl