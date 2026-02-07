import type { ComponentProps } from 'react';
import { components } from 'react-select';

export const DropdownIndicator = (
  props: ComponentProps<typeof components.DropdownIndicator>
) => (
  <components.DropdownIndicator {...props}>
    <i className="fa-solid fa-chevron-down text-surface-500 text-sm" aria-hidden />
  </components.DropdownIndicator>
);

export const ClearIndicator = (
  props: ComponentProps<typeof components.ClearIndicator>
) => (
  <components.ClearIndicator {...props}>
    <i className="fa-solid fa-xmark text-surface-500 text-sm" aria-hidden />
  </components.ClearIndicator>
);

export const MultiValueRemove = (
  props: ComponentProps<typeof components.MultiValueRemove>
) => (
  <components.MultiValueRemove {...props}>
    <i className="fa-solid fa-xmark text-[10px]" aria-hidden />
  </components.MultiValueRemove>
);
