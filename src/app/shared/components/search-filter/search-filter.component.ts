import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss',
  imports: [FeatherModule],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchFilterComponent),
      multi: true,
    },
  ],
})
export class SearchFilterComponent implements ControlValueAccessor {
  searchParam: string = '';

  @Input() borderRequired = true;
  @Input() placeholder: string = '';
  @Input() searchData: string = '';

  @Output() onClose = new EventEmitter<void>();
  @Output() searchParamValue = new EventEmitter<string>();

  private onChange: (value: string) => void = () => {};
  public onTouched: () => void = () => {};
  isDisabled = false;

  ngOnInit(): void {
    this.searchParam = this.searchData || '';
  }

  // Called when input changes
  onInputChange(event: any) {
    const value = (event.target as HTMLInputElement)?.value;
    this.searchParam = value;
    this.onChange(value);
    this.searchParamValue.emit(value);
  }

  closeSearchBar(): void {
    this.searchParam = '';
    this.onChange('');
    this.searchParamValue.emit('');
    this.onClose.emit();
  }

  // -------- ControlValueAccessor methods --------
  writeValue(value: string): void {
    this.searchParam = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
