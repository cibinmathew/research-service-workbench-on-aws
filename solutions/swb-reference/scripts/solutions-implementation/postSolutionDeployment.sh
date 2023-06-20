#!/bin/bash

read -p "Please enter your email address: " EMAIL
export regionShortName=test
export region=$(aws cloudformation describe-stacks --stack-name rsw-dev-test --output text --query 'Stacks[0].Outputs[?OutputKey==`awsRegion`].OutputValue')
export cognitoUserPoolId=$(aws cloudformation describe-stacks --stack-name rsw-dev-test --output text --query 'Stacks[0].Outputs[?OutputKey==`cognitoUserPoolId`].OutputValue')
export cognitoProgrammaticAccessUserPoolClientId=$(aws cloudformation describe-stacks --stack-name rsw-dev-test --output text --query 'Stacks[0].Outputs[?OutputKey==`cognitoProgrammaticAccessUserPoolClientId`].OutputValue')
export dynamicAuthDDBTableName=$(aws cloudformation describe-stacks --stack-name rsw-dev-test --output text --query 'Stacks[0].Outputs[?OutputKey==`dynamicAuthDDBTableName`].OutputValue')
aws ssm put-parameter --name "/swb/dev/rootUser/email/$regionShortName" --value $EMAIL --type 'SecureString' > /dev/null

rm -rf ./solutions/swb-reference/src/config/dev.yaml
rm -rf ./solutions/swb-reference/src/config/dev.json

echo "
stage: dev
awsRegion: $region
awsRegionShortName: $regionShortName
rootUserEmailParamStorePath: '/swb/dev/rootUser/email/$regionShortName'
userPoolId: $cognitoUserPoolId
" >> ./solutions/swb-reference/src/config/dev.yaml

echo "
{\"rsw-dev-test\": 
   {\"dynamicAuthDDBTableName\": \"$dynamicAuthDDBTableName\",
   \"cognitoProgrammaticAccessUserPoolClientId\": \"$cognitoProgrammaticAccessUserPoolClientId\",
    \"cognitoUserPoolId\": \"$cognitoUserPoolId\",
    \"awsRegion\": \"$region\"
   }
}" >> ./solutions/swb-reference/src/config/dev.json

npm install -g @microsoft/rush
rush update
cd solutions/swb-reference
STAGE=dev rushx run-postDeployment
STAGE=dev rushx run-postDeployment  # Need to run this twice currently