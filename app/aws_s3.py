import boto3
from .config import Config
import random
import string

def get_random_name(length):
    letters_and_digits = string.ascii_letters + string.digits
    result_str = ''.join((random.choice(letters_and_digits) for i in range(length)))
    return result_str

# s3 credentials to be stored as env variables in a config file

s3 = boto3.client(
    "s3",
    aws_access_key_id=Config.S3_KEY,
    aws_secret_access_key=Config.S3_SECRET
)
bucket = Config.S3_BUCKET

#This function posts to aws and returns a photo url
def upload_file_to_s3(file, acl="public-read"):
    ext = file.filename.split('.')[1]
    new_file_name = get_random_name(20) + '.' + ext
    try:

        s3.upload_fileobj(
            file,
            bucket,
            new_file_name,
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
        'https://deary.s3.us-east-2.amazonaws.com/', new_file_name)
    return photoUrl