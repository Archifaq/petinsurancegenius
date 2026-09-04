/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    runtime?: {
      env?: Record<string, string | undefined>;
    };
  }
}
