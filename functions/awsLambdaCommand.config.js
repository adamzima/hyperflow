var LAMBDA_URL  = process.env.LAMBDA_URL ? process.env.LAMBDA_URL : "https://tupo4jj0g4.execute-api.eu-central-1.amazonaws.com/prod/HyperflowExecutor";
//var GCF_URL  = process.env.GCF_URL ? process.env.GCF_URL :  'http://localhost:2000'

var S3_BUCKET = process.env.S3_BUCKET ? process.env.S3_BUCKET : "montage-lambda";
var S3_PATH   = process.env.S3_PATH ? process.env.S3_PATH : "data/0.25"; //prefix in a bucket with no leading or trailing slashes

exports.aws_lambda_url = LAMBDA_URL;

exports.options = {
     "storage": "s3",
     "bucket": S3_BUCKET,
     "prefix": S3_PATH
 };

