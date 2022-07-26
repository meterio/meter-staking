#!/bin/bash

# build
npm run build

# copy dist to mainnet S3
aws s3 sync ./dist/ s3://staking-staging.meter/ --delete --acl public-read

# invalidate mainnet cloudfront cache
aws cloudfront create-invalidation --distribution-id ET4HMEFSAP6A --paths "/*"

