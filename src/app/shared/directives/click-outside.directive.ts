import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: false,
})
export class ClickOutsideDirective {
  @Output() clickedOutside: EventEmitter<void> = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}

  // Listen for click events on the whole document
  @HostListener('document:click', ['$event.target'])
  public onOutsideClick = (_targetElement: HTMLElement): void => {};

  public onClick = (_targetElement: HTMLElement): void => {
    const clickedInside =
      this.elementRef.nativeElement.contains(_targetElement);
    if (!clickedInside) {
      this.clickedOutside.emit();
    }
  };
}
