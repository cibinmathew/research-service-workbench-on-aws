/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import * as appreg from '@aws-cdk/aws-servicecatalogappregistry-alpha';
import { SharePermission } from '@aws-cdk/aws-servicecatalogappregistry-alpha';
import { Aws, CfnMapping, Fn, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { applyTag } from './workbenchApplyTags';

export interface WorkbenchAppRegistryProps {
  solutionId: string;
  solutionName: string;
  solutionVersion: string;
  appRegistryApplicationName: string;
  applicationType: string;
  attributeGroupName: string;
  accountIds?: string[];
}

export class WorkbenchAppRegistry extends Construct {
  private _solutionId: string;
  private _solutionName: string;
  private _solutionVersion: string;
  private _appRegistryApplicationName: string;
  private _applicationType: string;
  private _attributeGroupName: string;
  private _accountIds: string[];
  private readonly _registryApplication: appreg.Application;
  private readonly _appRegMap: CfnMapping;

  public constructor(scope: Construct, id: string, props: WorkbenchAppRegistryProps) {
    super(scope, id);
    const stack: Stack = scope as Stack;
    this._solutionId = props.solutionId;
    this._appRegistryApplicationName = props.appRegistryApplicationName;
    this._solutionName = props.solutionName;
    this._applicationType = props.applicationType;
    this._solutionVersion = props.solutionVersion;
    this._attributeGroupName = props.attributeGroupName;
    this._accountIds = props.accountIds ? props.accountIds : [];
    this._appRegMap = this._createMap(stack);
    this._registryApplication = this._createAppRegistry(stack);
    this._applyTagsToApplication();
  }

  public applyAppRegistryToStacks(resourceStacks: Stack[]): void {
    resourceStacks.forEach((resourceStack) => {
      this._registryApplication.associateApplicationWithStack(resourceStack);
    });
  }

  private _createAppRegistry(stack: Stack): appreg.Application {
    const application = new appreg.Application(stack, 'AppRegistry', {
      applicationName: Fn.join('-', [
        this._appRegMap.findInMap('Data', 'AppRegistryApplicationName'),
        Aws.REGION,
        Aws.ACCOUNT_ID
      ]),
      description: `Service Catalog application to track and manage all your resources for the solution ${this._solutionName}`
    });

    if (this._accountIds.length > 0) {
      application.shareApplication({
        accounts: this._accountIds,
        sharePermission: SharePermission.ALLOW_ACCESS
      });
    }
    application.associateApplicationWithStack(stack);

    const attributeGroup = new appreg.AttributeGroup(stack, 'DefaultApplicationAttributes', {
      attributeGroupName: this._appRegMap.findInMap('Data', 'AttributeGroupName'),
      description: 'Attribute group for solution information',
      attributes: {
        applicationType: this._appRegMap.findInMap('Data', 'ApplicationType'),
        version: this._appRegMap.findInMap('Data', 'Version'),
        solutionID: this._appRegMap.findInMap('Data', 'ID'),
        solutionName: this._appRegMap.findInMap('Data', 'SolutionName')
      }
    });

    if (this._accountIds.length > 0) {
      attributeGroup.shareAttributeGroup({
        accounts: this._accountIds,
        sharePermission: SharePermission.ALLOW_ACCESS
      });
    }

    application.associateAttributeGroup(attributeGroup);

    return application;
  }

  private _createMap(stack: Stack): CfnMapping {
    const map = new CfnMapping(stack, `${this._solutionName}-AppRegMap`);
    map.setValue('Data', 'ID', this._solutionId);
    map.setValue('Data', 'Version', this._solutionVersion);
    map.setValue('Data', 'AppRegistryApplicationName', this._appRegistryApplicationName);
    map.setValue('Data', 'SolutionName', this._solutionName);
    map.setValue('Data', 'ApplicationType', this._applicationType);
    map.setValue('Data', 'AttributeGroupName', this._attributeGroupName);

    return map;
  }

  private _applyTagsToApplication(): void {
    applyTag(
      this._registryApplication,
      `${this._solutionName}:SolutionID`,
      this._appRegMap.findInMap('Data', 'ID')
    );
    applyTag(
      this._registryApplication,
      `${this._solutionName}:SolutionName`,
      this._appRegMap.findInMap('Data', 'SolutionName')
    );
    applyTag(
      this._registryApplication,
      `${this._solutionName}:SolutionVersion`,
      this._appRegMap.findInMap('Data', 'Version')
    );
    applyTag(
      this._registryApplication,
      `${this._solutionName}:ApplicationType`,
      this._appRegMap.findInMap('Data', 'ApplicationType')
    );
  }
}