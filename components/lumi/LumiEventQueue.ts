import { LumiMoment, LumiEventItem } from './LumiTypes';
import { MOMENT_CONFIGS, MomentConfig } from './LumiConfig';


export class LumiEventQueue {
  private queue: LumiEventItem[] = [];
  private currentEvent: LumiEventItem | null = null;
  private timer: NodeJS.Timeout | null = null;
  private onEventChange: (event: LumiEventItem | null) => void;

  constructor(onEventChange: (event: LumiEventItem | null) => void) {
    this.onEventChange = onEventChange;
  }

  public enqueue(moment: LumiMoment, customQuote?: string): void {
    const config = MOMENT_CONFIGS[moment];
    const item: LumiEventItem = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      moment,
      quote: customQuote || config.defaultQuote,
      priority: config.priority,
      duration: config.duration,
      particleType: config.particleType,
      animationOverride: config.animation,
      createdAt: Date.now(),
    };

    // If higher priority than current playing event, interrupt or preempt
    if (this.currentEvent && item.priority > this.currentEvent.priority) {
      this.clearTimer();
      // Push interrupted event back into queue if it was major
      if (this.currentEvent.priority >= 50) {
        this.queue.unshift(this.currentEvent);
      }
      this.play(item);
      return;
    }

    // Insert sorted by descending priority
    this.queue.push(item);
    this.queue.sort((a, b) => b.priority - a.priority);

    if (!this.currentEvent) {
      this.processNext();
    }
  }

  private processNext(): void {
    if (this.queue.length === 0) {
      this.currentEvent = null;
      this.onEventChange(null);
      return;
    }

    const next = this.queue.shift()!;
    this.play(next);
  }

  private play(item: LumiEventItem): void {
    this.currentEvent = item;
    this.onEventChange(item);

    this.clearTimer();
    this.timer = setTimeout(() => {
      this.processNext();
    }, item.duration);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public destroy(): void {
    this.clearTimer();
    this.queue = [];
    this.currentEvent = null;
  }
}
