export function range(from: number, to: number, step: number): number[]
export function range(from: number, to: number): number[]
export function range(to: number): number[]
export function range(...args: number[]): number[] {
  if (args.length === 1) {
    const [to] = args
    return new Array(to).fill(undefined).map((_, index) => index)
  }
  if (args.length === 2) {
    const [from, to] = args
    return new Array(to).fill(undefined).map((_, index) => index + from)
  }
  if (args.length === 3) {
    const [from, to, step] = args
    return new Array(to).fill(undefined).map((_, index) => index * step + from)
  }
  throw new Error("Unsupported arguments")
}
