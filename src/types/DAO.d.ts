import { ZodError } from "zod";
import { STATUS, STATUSES } from "./enums.js";

interface SuccessResult<T> {
  status: STATUSES.SUCCESS;
  payload: T;
  error?: never;
}

type ErrorResult = {
  status: STATUSES.ERROR;
  payload?: never;
  error: string | ZodError;
};

export type PersistResult<T> = SuccessResult<T> | ErrorResult;
