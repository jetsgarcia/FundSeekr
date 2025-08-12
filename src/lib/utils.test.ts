import { formatCurrency } from './utils';

describe('formatCurrency', () => {
  test('formats small numbers with PHP currency', () => {
    expect(formatCurrency(100)).toBe('₱100');
    expect(formatCurrency(500)).toBe('₱500');
    expect(formatCurrency(999)).toBe('₱999');
  });

  test('formats thousands with compact notation', () => {
    expect(formatCurrency(1000)).toBe('₱1K');
    expect(formatCurrency(1500)).toBe('₱2K');
    expect(formatCurrency(9999)).toBe('₱10K');
  });

  test('formats millions with compact notation', () => {
    expect(formatCurrency(1000000)).toBe('₱1M');
    expect(formatCurrency(1500000)).toBe('₱2M');
    expect(formatCurrency(2500000)).toBe('₱3M');
  });

  test('formats billions with compact notation', () => {
    expect(formatCurrency(1000000000)).toBe('₱1B');
    expect(formatCurrency(1500000000)).toBe('₱2B');
    expect(formatCurrency(2500000000)).toBe('₱3B');
  });

  test('handles zero value', () => {
    expect(formatCurrency(0)).toBe('₱0');
  });

  test('handles negative values', () => {
    expect(formatCurrency(-100)).toBe('-₱100');
    expect(formatCurrency(-1000)).toBe('-₱1K');
    expect(formatCurrency(-1000000)).toBe('-₱1M');
  });

  test('rounds decimal values to whole numbers', () => {
    expect(formatCurrency(100.99)).toBe('₱101');
    expect(formatCurrency(999.49)).toBe('₱999');
    expect(formatCurrency(1000.5)).toBe('₱1K');
  });

  test('handles very large numbers', () => {
    expect(formatCurrency(1000000000000)).toBe('₱1T'); // 1 trillion
    expect(formatCurrency(1500000000000)).toBe('₱2T');
  });

  test('handles floating point precision edge cases', () => {
    expect(formatCurrency(0.1 + 0.2)).toBe('₱0'); // JavaScript floating point issue
    expect(formatCurrency(999.999999)).toBe('₱1K');
  });

  test('formats mid-range values correctly', () => {
    expect(formatCurrency(12345)).toBe('₱12K');
    expect(formatCurrency(123456)).toBe('₱123K');
    expect(formatCurrency(1234567)).toBe('₱1M');
  });
});
