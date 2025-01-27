/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import ClientSession from '../../../support/clientSession';
import { PaabHelper } from '../../../support/complex/paabHelper';
import HttpError from '../../../support/utils/HttpError';
import { checkHttpError } from '../../../support/utils/utilities';

describe('Soft Delete Project negative tests', () => {
  const paabHelper = new PaabHelper(2);
  let adminSession: ClientSession;
  let pa1Session: ClientSession;
  let rs1Session: ClientSession;
  let anonymousSession: ClientSession;
  let project1Id: string;
  let project2Id: string;

  beforeEach(() => {
    expect.hasAssertions();
  });

  beforeAll(async () => {
    ({ adminSession, pa1Session, rs1Session, anonymousSession, project1Id, project2Id } =
      await paabHelper.createResources(__filename));
  });

  afterAll(async () => {
    await paabHelper.cleanup();
  });

  describe('with Project that does not exist', () => {
    const invalidProjectId = 'proj-00000000-0000-0000-0000-000000000000';

    test('it throws 404 error', async () => {
      try {
        await adminSession.resources.projects.project(invalidProjectId).delete();
      } catch (e) {
        checkHttpError(
          e,
          new HttpError(404, {
            error: 'Not Found',
            message: `Could not find project ${invalidProjectId}`
          })
        );
      }
    });
  });

  test('Project Admin passing in project it does not belong to gets 403', async () => {
    try {
      await pa1Session.resources.projects.project(project2Id).delete();
    } catch (e) {
      checkHttpError(
        e,
        new HttpError(403, {
          error: 'User is not authorized'
        })
      );
    }
  });

  test('Researcher gets 403', async () => {
    try {
      await rs1Session.resources.projects.project(project1Id).delete();
    } catch (e) {
      checkHttpError(
        e,
        new HttpError(403, {
          error: 'User is not authorized'
        })
      );
    }
  });

  test('unauthenticated user gets 403', async () => {
    try {
      await anonymousSession.resources.projects.project(project1Id).delete();
    } catch (e) {
      checkHttpError(e, new HttpError(403, {}));
    }
  });
});
