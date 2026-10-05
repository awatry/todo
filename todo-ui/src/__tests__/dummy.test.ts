import { describe, it, expect, vi } from 'vitest';

// Sample test for a simple utility function.
// In a real application, this would import a component or service.
const sum = (a: number, b: number): number => a + b;

describe('Utility Functions', () => {
  it('should correctly add two numbers', () => {
    // We use vi.fn() here to show usage of vitest mocks, although not strictly necessary for sum.
    const mockFn = vi.fn();
    expect(mockFn).toHaveBeenCalledTimes(0);

    const result = sum(5, 10);
    expect(result).toBe(15);
  });

  it('should handle negative numbers', () => {
    expect(sum(-5, 5)).toBe(0);
    expect(sum(-1, -1)).toBe(-2);
  });
});
