#!/bin/bash

# Create VPC
echo "Creating VPC..."

VPC_ID=$(aws ec2 create-vpc \
    --cidr-block '192.168.0.0/16' \
    --query 'Vpc.{VpcId:VpcId}' \
    --output text)

echo "VPC ID \"$VPC_ID\" created"

# Add name tag to VPC
aws ec2 create-tags \
    --resources $VPC_ID \
    --tags "Key=Name,Value=amazon-dynamodb-building-nosql-database-driven-applications-vpc"

# Get main route table ID
MAIN_ROUTE_TABLE_ID=$(aws ec2 describe-route-tables \
    --filters Name=vpc-id,Values=$VPC_ID Name=association.main,Values=true \
    --query 'RouteTables[*].{RouteTableId:RouteTableId}' \
    --output text)

echo "Main route table ID is \"$MAIN_ROUTE_TABLE_ID\""

# Create private subnet
echo "Creating private subnet..."

PRIVATE_SUBNET_ID=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block '192.168.0.0/24' \
    --query 'Subnet.{SubnetId:SubnetId}' \
    --output text)

echo "Subnet ID \"$PRIVATE_SUBNET_ID\" created"

# Add name tag to private subnet
aws ec2 create-tags \
    --resources $PRIVATE_SUBNET_ID \
    --tags "Key=Name,Value=amazon-dynamodb-building-nosql-database-driven-applications-subnet" \

# Create Lambda security group
echo "Creating Lambda security group..."

LAMBDA_SECURITY_GROUP_ID=$(aws ec2 create-security-group \
    --description 'Lambda security group' \
    --group-name 'amazon-dynamodb-building-nosql-database-driven-applications-lambda-security-group' \
    --vpc-id $VPC_ID \
    --query 'GroupId' \
    --output text)

echo "Lambda security group ID \"$LAMBDA_SECURITY_GROUP_ID\" created"

echo "Completed"
