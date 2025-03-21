// 矩阵转置
export function convertToMatrixIndex(i: number) {
  const base = 5;
  const row = Math.floor(i / base);
  const col = i % base;
  return col * base + row;
}
