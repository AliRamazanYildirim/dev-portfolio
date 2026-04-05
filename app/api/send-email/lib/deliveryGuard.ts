import { AppError } from "@/lib/errors";
import { sendEmailSecurityConfig } from "./securityConfig";

type QueueJob = () => void;

export class SendEmailDeliveryGuard {
  private static activeCount = 0;
  private static queue: QueueJob[] = [];
  private static failureCount = 0;
  private static circuitOpenUntilMs = 0;

  private static get maxConcurrent() {
    return sendEmailSecurityConfig.delivery.maxConcurrent;
  }

  private static get maxQueueSize() {
    return sendEmailSecurityConfig.delivery.maxQueueSize;
  }

  private static get circuitFailureThreshold() {
    return sendEmailSecurityConfig.delivery.circuitFailureThreshold;
  }

  private static get circuitOpenMs() {
    return sendEmailSecurityConfig.delivery.circuitOpenSec * 1000;
  }

  static async run<T>(task: () => Promise<T>): Promise<T> {
    this.assertCircuitClosed();

    return new Promise<T>((resolve, reject) => {
      const job = () => {
        void this.execute(task, resolve, reject);
      };

      if (this.activeCount < this.maxConcurrent) {
        job();
        return;
      }

      if (this.queue.length >= this.maxQueueSize) {
        reject(
          new AppError(
            "Email queue is full. Please try again later.",
            503,
          ),
        );
        return;
      }

      this.queue.push(job);
    });
  }

  private static async execute<T>(
    task: () => Promise<T>,
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: unknown) => void,
  ) {
    this.activeCount += 1;

    try {
      this.assertCircuitClosed();
      const result = await task();
      this.onSuccess();
      resolve(result);
    } catch (error) {
      this.onFailure();
      reject(error);
    } finally {
      this.activeCount = Math.max(0, this.activeCount - 1);
      this.drainQueue();
    }
  }

  private static drainQueue() {
    while (this.activeCount < this.maxConcurrent && this.queue.length > 0) {
      const next = this.queue.shift();
      if (!next) return;
      next();
    }
  }

  private static assertCircuitClosed() {
    if (Date.now() < this.circuitOpenUntilMs) {
      throw new AppError(
        "Email service temporarily unavailable. Please try again later.",
        503,
      );
    }
  }

  private static onSuccess() {
    this.failureCount = 0;
  }

  private static onFailure() {
    this.failureCount += 1;

    if (this.failureCount < this.circuitFailureThreshold) {
      return;
    }

    this.circuitOpenUntilMs = Date.now() + this.circuitOpenMs;
    this.failureCount = 0;
  }
}
