# Static Website Hosting with AWS S3, CloudFront, and ACM

[![Pulumi](https://img.shields.io/badge/pulumi-infra%20as%20code-f04e35)](https://www.pulumi.com/)
[![AWS](https://img.shields.io/badge/AWS-serverless-ff9900)](https://aws.amazon.com)
[![TypeScript](https://img.shields.io/badge/typescript-4.9+-3178c6)](https://www.typescriptlang.org/)
[![CloudFront Pricing](https://img.shields.io/badge/AWS%20CloudFront-Pricing-232f3e?logo=amazon-aws)](https://aws.amazon.com/cloudfront/pricing/)
[![ACM Pricing](https://img.shields.io/badge/AWS%20ACM-Free–Export–0.50-232f3e?logo=amazon-aws)](https://aws.amazon.com/certificate-manager/pricing/)
[![S3 Pricing](https://img.shields.io/badge/AWS%20S3-Pricing-569A31?logo=amazon-aws)](https://aws.amazon.com/s3/pricing/)

## A fully serverless, secure, and fast static website hosting solution on AWS, leveraging S3 for storage, CloudFront for CDN, and ACM for TLS/SSL encryption.

### Key Features 

### 1. Infrastructure Components (Pulumi)
- **AWS Resources**:
 -  S3 Bucket: Stores static website files securely (private access, block public access).

 -  CloudFront Distribution: Caches and serves content globally with HTTPS.

 -  ACM Certificate: Provides TLS/SSL for the custom domain.

 -  Origin Access Control (OAC): Ensures only CloudFront can read from S3.

### 2. Security Measures
 -  S3 buckets not publicly accessible; only CloudFront can access objects.

 -  TLS/SSL encryption using ACM certificates.

 -  Resource tagging for governance and cost tracking.

 -  Pulumi manages sensitive configuration securely.


### 3. Deployment Instructions
```bash
git clone https://github.com/jeffkessie/AWS-Certificate-Management.git
cd AWS-Certificate-Management
```

## Install Dependencies
```bash
npm install
```

## Deploy Infrastructure 

```bash
pulumi up
pulumi logs -f
```

## Upload Website Files

```bash
aws s3 sync ./www s3://<bucket-name>

```
---

This project implements a secure, serverless static website hosting solution on AWS, using S3, CloudFront, and ACM. The architecture ensures high availability, low latency, and robust security while remaining fully serverless and cost-efficient. The S3 bucket acts as the origin for static assets, storing HTML, CSS, and JavaScript files in a private, non-public bucket to prevent unauthorized access.

From an architectural perspective, the CloudFront distribution operates as a globally distributed edge network, implementing a sophisticated content delivery infrastructure that leverages AWS's worldwide network of Points of Presence (PoPs). The distribution is engineered with Origin Access Control (OAC), a security mechanism that establishes an IAM-based authentication protocol between CloudFront and the origin S3 bucket.

This configuration enforces a strict security boundary through several technical mechanisms:

**Global Edge Network Architecture**: The CDN infrastructure utilizes 400+ edge locations globally, implementing latency-based routing through Amazon Route 53 and Anycast IP addressing to optimize packet delivery paths.

**Zero-Trust Origin Access Model**: OAC implements cryptographic signing of requests using SigV4 authentication, replacing the legacy Origin Access Identity (OAI) mechanism with enhanced security protocols that support SSE-KMS and POST/PUT/OPTIONS requests.

**Security Through Obscurity Elimination**: The S3 bucket policy is configured with explicit deny conditions that invalidate all non-CloudFront requests through IAM condition contexts (aws:ViaHeader and aws:UserAgent), effectively creating a private origin that only accepts authenticated requests from the CloudFront distribution ARN.

**End-to-End Encryption Enforcement**: All origin fetches leverage TLS 1.2+ protocols, while edge-to-viewer connections benefit from modern cipher suites through CloudFront's certificate management system, ensuring encrypted transit throughout the entire request lifecycle.

**Cache Optimization Architecture**: The distribution implements a multi-tier caching hierarchy with edge, regional, and origin cache layers, configured through cache policies that control TTL behaviors and respect origin cache-control headers while minimizing origin offload.


We use **AWS Certificate Manager (ACM)** to automatically provision and renew TLS/SSL certificates for your custom domain. This ensures all traffic to your application is encrypted via HTTPS, protecting user data in transit and providing the trusted padlock icon in the browser.

This approach is fully managed and eliminates the traditional operational risk of manual certificate expiration, which is a common cause of outages. By automating renewals, we ensure uninterrupted, secure service for your users.

From a **SOC 2** compliance perspective, this automated encryption control directly satisfies criteria for security and availability. It provides auditable evidence that we protect customer data with always-current encryption without relying on error-prone manual processes.

The certificates are integrated with our global CloudFront CDN, ensuring security and performance are delivered seamlessly together across all your user locations.

---

MIT License

Copyright (c) 2025 [Cloud Commerical Holdings LLC]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


---