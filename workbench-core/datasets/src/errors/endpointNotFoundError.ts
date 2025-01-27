/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

export class EndpointNotFoundError extends Error {
  public readonly isEndpointNotFoundError: boolean;

  public constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
    this.isEndpointNotFoundError = true;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, EndpointNotFoundError);
    }
  }
}

export function isEndpointNotFoundError(error: unknown): error is EndpointNotFoundError {
  return (
    Boolean(error) &&
    error instanceof Error &&
    (error as EndpointNotFoundError).isEndpointNotFoundError === true
  );
}
