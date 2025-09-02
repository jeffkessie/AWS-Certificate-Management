import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { siteBucket } from "./s3";

const domainName = "your-site-goes-here.com";

/* ACM cert (CloudFront) */
const cert = new aws.acm.Certificate("cert", {
    domainName,
    validationMethod: "DNS",
});

   /* CloudFront Origin Access Control (OAC) */   
const oac = new aws.cloudfront.OriginAccessControl("oac", {
    name: "s3-oac",
    originAccessControlOriginType: "s3",
    signingBehavior: "always",
    signingProtocol: "sigv4",
});

  /* CloudFront distribution */
const distribution = new aws.cloudfront.Distribution("cdn", {
    enabled: true,
    origins: [{
        originId: "s3-origin",
        domainName: siteBucket.bucketRegionalDomainName,
        originAccessControlId: oac.id,
    }],
    defaultCacheBehavior: {
        targetOriginId: "s3-origin",
        viewerProtocolPolicy: "redirect-to-https",
        allowedMethods: ["GET", "HEAD"],
        cachedMethods: ["GET", "HEAD"],
        forwardedValues: {
            queryString: false,
            cookies: { forward: "none" },
        },
    },
    viewerCertificate: {
        acmCertificateArn: cert.arn,
        sslSupportMethod: "sni-only",
    },
    restrictions: {
        geoRestriction: { restrictionType: "none" },
    },
    defaultRootObject: "index.html",
});

/*  Policy so only CloudFront can read */
new aws.s3.BucketPolicy("bucketPolicy", {
    bucket: siteBucket.bucket,
    policy: pulumi.all([siteBucket.bucket, distribution.arn]).apply(([bucketName, distArn]) => JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Principal: { Service: "cloudfront.amazonaws.com" },
            Action: "s3:GetObject",
            Resource: [`arn:aws:s3:::${bucketName}/*`],
            Condition: {
                StringEquals: {
                    "AWS:SourceArn": distArn,
                },
            },
        }],
    })),
});


  /* Exports */
export const bucketName = siteBucket.bucket;
export const cdnDomainName = distribution.domainName;
