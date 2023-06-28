/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { z } from '@aws/workbench-core-base';

// eslint-disable-next-line @rushstack/typedef-var
export const CreateCostCenterRequestParser = z.object({
  name: z.string().rswName().required(),
  accountId: z.string().accountId().required(),
  description: z.string().rswDescription().required()
});

export type CreateCostCenterRequest = z.infer<typeof CreateCostCenterRequestParser>;
