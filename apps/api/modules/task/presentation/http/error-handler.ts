import type { Context } from "hono";
import { ApplicationError, DomainError, InfrastructureError } from "@/shared_kernel/errors";
import { generateUlid } from "@/shared_kernel/ids";

type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details: Record<string, unknown>;
    trace_id: string;
  };
};

const errorResponse = (c: Context, status: number, code: string, message: string): Response => {
  const body: ErrorResponse = {
    error: { code, message, details: {}, trace_id: generateUlid() },
  };
  return c.json(body, status as 400 | 403 | 404 | 500 | 503);
};

export const handleError = (err: unknown, c: Context): Response => {
  if (err instanceof DomainError) {
    return errorResponse(c, 400, err.code, err.message);
  }
  if (err instanceof ApplicationError) {
    if (err.code === "task.forbidden") return errorResponse(c, 403, err.code, err.message);
    if (err.code.endsWith("not_found")) return errorResponse(c, 404, err.code, err.message);
    return errorResponse(c, 400, err.code, err.message);
  }
  if (err instanceof InfrastructureError) {
    console.error("[InfrastructureError]", err);
    return errorResponse(c, 503, err.code, "サービスが一時的に利用できません");
  }
  console.error("[UnexpectedError]", err);
  return errorResponse(c, 500, "unexpected_error", "予期しないエラーが発生しました");
};
