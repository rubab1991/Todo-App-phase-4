// Type declaration for uuid v9
// uuid v9 bundles its own types but moduleResolution:"node" in tsconfig
// does not pick them up via the package exports field.
// This shim satisfies TypeScript strict mode in the Docker build.
declare module 'uuid' {
  export function v4(): string;
  export function v1(): string;
  export function v3(name: string | Uint8Array, namespace: string | Uint8Array): string;
  export function v5(name: string | Uint8Array, namespace: string | Uint8Array): string;
  export function validate(uuid: string): boolean;
  export function version(uuid: string): number;
  export function parse(uuid: string): Uint8Array;
  export function stringify(arr: Uint8Array): string;
  export const NIL: string;
}
