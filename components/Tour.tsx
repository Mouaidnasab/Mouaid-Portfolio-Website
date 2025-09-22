import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

export interface TourStep {
  selector: string;
  title: string;
  content: string;
}

interface TourProps {
  steps: TourStep[];
  stepIndex: number;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
}

const PADDING = 10;
const TOOLTIP_OFFSET = 15;

const Tour: React.FC<TourProps> = ({ steps, stepIndex, isActive, onNext, onPrev, onFinish }) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPortalRoot(document.getElementById('tour-portal-root'));
  }, []);

  // Effect to find the target element and get its dimensions
  useLayoutEffect(() => {
    if (!isActive) {
      setTargetRect(null);
      return;
    }

    const step = steps[stepIndex];
    const element = step ? document.querySelector(step.selector) : null;

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

      const updateRect = () => {
        setTargetRect(element.getBoundingClientRect());
      };

      // Initial calculation, with a delay for scroll to finish
      const timeoutId = setTimeout(updateRect, 300);

      // Add resize listener to update rect on window resize
      window.addEventListener('resize', updateRect);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', updateRect);
      };
    } else {
      setTargetRect(null); // Hide if element not found
    }
  }, [isActive, stepIndex, steps]);
  
  // Effect to calculate tooltip position when targetRect changes
  useLayoutEffect(() => {
    if (!targetRect || !tooltipRef.current) {
      setTooltipStyle({ opacity: 0, pointerEvents: 'none' });
      return;
    }

    const tooltipWidth = tooltipRef.current.offsetWidth;
    const tooltipHeight = tooltipRef.current.offsetHeight;
    const { innerWidth, innerHeight } = window;

    // Vertical position (prefer below, then above, then fallback)
    let top;
    if (targetRect.bottom + tooltipHeight + TOOLTIP_OFFSET < innerHeight) {
      top = targetRect.bottom + TOOLTIP_OFFSET;
    } else if (targetRect.top - tooltipHeight - TOOLTIP_OFFSET > 0) {
      top = targetRect.top - tooltipHeight - TOOLTIP_OFFSET;
    } else {
      top = PADDING;
    }

    // Horizontal position (prefer centered, then adjust for viewport edges)
    const centerPos = targetRect.left + targetRect.width / 2;
    let left = centerPos;
    let transform = 'translateX(-50%)';

    const spaceOnRight = innerWidth - (centerPos + tooltipWidth / 2) - PADDING;
    const spaceOnLeft = centerPos - tooltipWidth / 2 - PADDING;

    if (spaceOnRight < 0) {
      // Overflows on the right, so position it to the left of the target element
      left = targetRect.left - TOOLTIP_OFFSET;
      transform = 'translateX(-100%)';
    } else if (spaceOnLeft < 0) {
      // Overflows on the left, so position it to the right of the target element
      left = targetRect.right + TOOLTIP_OFFSET;
      transform = 'translateX(0%)';
    }

    setTooltipStyle({
      opacity: 1,
      top: `${top}px`,
      left: `${left}px`,
      transform: transform,
      transition: 'opacity 0.3s, top 0.3s, left 0.3s, transform 0.3s',
    });
  }, [targetRect]);


  if (!isActive || !portalRoot || !targetRect) return null;

  const isLastStep = stepIndex === steps.length - 1;
  const currentStep = steps[stepIndex];

  const content = (
    <div className="fixed inset-0 z-50 animate-fade-in" aria-live="polite">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        style={{
          clipPath: `path('M0,0H${window.innerWidth}V${window.innerHeight}H0V0ZM${targetRect.x - PADDING},${targetRect.y - PADDING}V${targetRect.y + targetRect.height + PADDING}H${targetRect.x + targetRect.width + PADDING}V${targetRect.y - PADDING}H${targetRect.x - PADDING}Z')`,
        }}
        onClick={onFinish}
      />
      
      <div
        ref={tooltipRef}
        className="absolute w-80 max-w-[calc(100vw-2rem)] bg-neutral-dark/80 backdrop-blur-xl border border-glass-stroke rounded-2xl shadow-2xl p-5 text-white"
        style={tooltipStyle}
        role="dialog"
        aria-labelledby="tour-tooltip-title"
      >
        <h3 id="tour-tooltip-title" className="text-lg font-bold text-white mb-2">{currentStep.title}</h3>
        <p className="text-white/80 text-sm mb-4">{currentStep.content}</p>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-white/60">{stepIndex + 1} / {steps.length}</span>
          <div className="flex items-center gap-3">
            {stepIndex > 0 && (
              <button onClick={onPrev} className="px-4 py-1.5 text-sm rounded-lg font-semibold text-white/80 bg-white/10 hover:bg-white/20 transition-colors">
                Previous
              </button>
            )}
            <button onClick={isLastStep ? onFinish : onNext} className="px-4 py-1.5 text-sm rounded-lg font-semibold text-white bg-accent hover:bg-accent/80 transition-colors">
              {isLastStep ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
        <button onClick={onFinish} className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors" aria-label="Close tour">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, portalRoot);
};

export default Tour;
