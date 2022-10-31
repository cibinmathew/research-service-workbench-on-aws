/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Permission, PermissionsMap } from '@aws/workbench-core-authorization';

const adminPermissions: Permission[] = [
  {
    effect: 'ALLOW',
    action: 'READ',
    subject: 'Example'
  },
  {
    effect: 'ALLOW',
    action: 'CREATE',
    subject: 'Dataset'
  },
  {
    effect: 'ALLOW',
    action: 'READ',
    subject: 'Dataset'
  },
  {
    effect: 'ALLOW',
    action: 'UPDATE',
    subject: 'Dataset'
  },
  {
    effect: 'ALLOW',
    action: 'DELETE',
    subject: 'Dataset'
  },
  {
    effect: 'ALLOW',
    action: 'READ',
    subject: 'Role'
  },
  {
    effect: 'ALLOW',
    action: 'UPDATE',
    subject: 'Role'
  },
  {
    effect: 'ALLOW',
    action: 'CREATE',
    subject: 'User'
  },
  {
    effect: 'ALLOW',
    action: 'READ',
    subject: 'User'
  }
];

export const permissionsMap: PermissionsMap = {
  Admin: adminPermissions
};