// Simple smoke test to verify Jest setup is working
describe("Jest Setup", () => {
  test("basic Jest functionality works", () => {
    expect(1 + 1).toBe(2);
    expect("hello").toMatch(/hello/);
    expect([1, 2, 3]).toContain(2);
  });

  test("can test async functions", async () => {
    const promise = Promise.resolve("success");
    await expect(promise).resolves.toBe("success");
  });

  test("mock functions work", () => {
    const mockFn = jest.fn();
    mockFn("test");

    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledWith("test");
  });
});
