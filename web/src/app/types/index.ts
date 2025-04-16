export type Theme = "dark" | "light";

export type MapValueType<M> = M extends Map<any, infer V> ? V : never;
