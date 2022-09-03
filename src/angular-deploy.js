const { exec } = require("child_process");


console.log("Deploying to AWS...", process.argv);

if (process.argv.length != 4) {
    console.error("Usage: node angular-deploy.js {S3 bucket name} {Cloud Front Distribution ID}");
    return;
}

const s3Bucket = process.argv[2];
const cloudFrontId = process.argv[3];

const deployFiles = `aws s3 sync --delete dist/cmh.vmf.poc.hoa-angular s3://${s3Bucket} --cache-control max-age=86400000,public`;
const updateCaching = `aws s3 cp s3://${s3Bucket} s3://${s3Bucket} --recursive --exclude "*" --include "*.html" --metadata-directive REPLACE --cache-control max-age=0,must-revalidate,public --content-type "text/html; charset=utf-8"`;
const invalidateCache = `aws cloudfront create-invalidation --distribution-id ${cloudFrontId} --paths \"/*\"`;

exec(`${deployFiles} && ${updateCaching} && ${invalidateCache}`, (error, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
});