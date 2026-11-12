// Top-level executable statements precede record declarations in C# programs.
export function orderTypes(code) {
  const lines = code.split("\n");
  const types = lines.filter((line) =>
    /^(?:public )?record \w+.*;\s*$/.test(line),
  );
  return types.length
    ? [...lines.filter((line) => !types.includes(line)), "", ...types].join(
        "\n",
      )
    : code;
}
