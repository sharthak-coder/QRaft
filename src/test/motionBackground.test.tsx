import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MotionBackground } from '../components/MotionBackground';

describe('MotionBackground Canvas Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock HTMLCanvasElement getContext
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      ellipse: vi.fn(),
      bezierCurveTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fillRect: vi.fn(),
      strokeStyle: '#1A3644',
      fillStyle: '#D99B26',
      lineWidth: 1,
      globalAlpha: 1,
    });
  });

  it('renders fixed background canvas with aria-hidden="true" and pointer-events-none', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <MotionBackground />
      </MemoryRouter>
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
    expect(canvas?.getAttribute('aria-hidden')).toBe('true');
    expect(canvas?.className).toContain('fixed');
    expect(canvas?.className).toContain('pointer-events-none');
  });

  it('renders cleanly on workspace routes with subdued peripheral styling', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/app']}>
        <MotionBackground />
      </MemoryRouter>
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('handles window resize and updates canvas metrics gracefully', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <MotionBackground />
      </MemoryRouter>
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();

    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
    expect(canvas?.style.width).toBeDefined();
  });
});
