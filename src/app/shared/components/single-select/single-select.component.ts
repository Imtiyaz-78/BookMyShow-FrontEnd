import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-single-select',
  standalone: true,
  templateUrl: './single-select.component.html',
  styleUrls: ['./single-select.component.scss'],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleSelectComponent),
      multi: true,
    },
  ],
  imports: [FeatherModule],
})
export class SingleSelectComponent implements ControlValueAccessor {
  @Input() optionList: any[] = [];
  @Input() placeholder: string = 'Select Role';

  value: string | null = null;
  isOpen = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // optional: implement disabled state
  setDisabledState?(isDisabled: boolean): void {}

  // Custom methods
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: any) {
    this.value = option;
    this.onChange(this.value);
    this.onTouched();
    this.isOpen = false;
  }

  get selectedLabel(): string {
    if (!this.value) {
      return this.placeholder;
    } else {
      return this.value;
    }
  }
}
