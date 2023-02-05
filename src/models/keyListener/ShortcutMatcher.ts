export class ShortcutMatcher {
  private alt: boolean;
  private ctrl: boolean;
  private meta: boolean;
  private shift: boolean;
  private key: string;

  private constructor(control: boolean, alt: boolean, shift: boolean, meta: boolean, key: string) {
    this.ctrl = control;
    this.meta = meta;
    this.alt = alt;
    this.shift = shift;
    this.key = key;
  }

  static fromString(str: string, separator: string = '+'): ShortcutMatcher {
    const keys = str.split(separator).map((s) => s.trim());
    const modifiers: any = {};
    for (const k of keys) {
      if (k.toUpperCase() === 'SHIFT') {
        modifiers.shift = true;
      } else if (k.toUpperCase() === 'CTRL' || k.toUpperCase() === 'CONTROL') {
        modifiers.ctrl = true;
      } else if (k.toUpperCase() === 'META' || k.toUpperCase() === 'OS') {
        modifiers.meta = true;
      } else if (k.toUpperCase() === 'ALT') {
        modifiers.alt = true;
      } else {
        modifiers.key = k.toUpperCase();
      }
    }
    return new ShortcutMatcher(
      modifiers.ctrl,
      modifiers.alt,
      modifiers.shift,
      modifiers.meta,
      modifiers.key
    );
  }

  matches(evt: KeyboardEvent) {
    return (
      evt.ctrlKey === Boolean(this.ctrl) &&
      evt.altKey === Boolean(this.alt) &&
      evt.shiftKey === Boolean(this.shift) &&
      evt.metaKey === Boolean(this.meta) &&
      evt.key.toUpperCase() === this.key.toUpperCase()
    );
  }
}
