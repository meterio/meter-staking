#!/bin/bash

# build
npm run build

# copy dist to mainnet S3
aws s3 sync ./dist/ s3://staking.meter.io/ --delete --acl public-read

# invalidate mainnet cloudfront cache
aws cloudfront create-invalidation --distribution-id E19XYLCM9RWWW9 --paths "/*"

