import { describe, it, expect } from 'vitest';

import { applyDeadzone } from '../../src/shared/gamepad-mapping.js';

describe('applyDeadzone', () => {
  it('returns 0 for values within the deadzone', () => {
    expect(applyDeadzone(0, 0.1)).toBe(0);
    expect(applyDeadzone(0.05, 0.1)).toBe(0);
    expect(applyDeadzone(-0.09, 0.1)).toBe(0);
  });

  it('scales values outside the deadzone back to the full range', () => {
    expect(applyDeadzone(0.1, 0.1)).toBe(0);
    expect(applyDeadzone(1, 0.1)).toBeCloseTo(1);
    expect(applyDeadzone(0.55, 0.1)).toBeCloseTo(0.5);
    expect(applyDeadzone(-0.55, 0.1)).toBeCloseTo(-0.5);
  });

  it('preserves the sign of the input', () => {
    expect(Math.sign(applyDeadzone(-0.8, 0.1))).toBe(-1);
    expect(Math.sign(applyDeadzone(0.8, 0.1))).toBe(1);
  });
});
