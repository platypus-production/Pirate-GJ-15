// @HINT: Find better type
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type FunctionWithUnknowArgs = (...rest: any[]) => any;
