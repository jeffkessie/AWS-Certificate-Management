import * as aws from "@pulumi/aws";


const domainName = "your-site-goes-here.com";

// Private s3 bucket for hosting 
export const siteBucket = new aws.s3.Bucket("siteBucket", {
    bucket: domainName,
    forceDestroy: true,
    tags: {
        Environment: "sandbox",
        Project: "world-wide-website",
        Owner: "Cloud-Commerical-Holdings-LLC",
    },
});

// Block all public access
export const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("publicAccessBlock", {
    bucket: siteBucket.id,
    blockPublicAcls: true,
    blockPublicPolicy: true,
    ignorePublicAcls: true,
    restrictPublicBuckets: true,
});


