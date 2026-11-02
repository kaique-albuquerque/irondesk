export interface SelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
}

export interface PageMeta {
  title: string;
  description: string;
}
