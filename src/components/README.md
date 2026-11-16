# Shared UI patterns

Reuse existing components before building another version of an established UI. When a new UI pattern will be repeated, extract a shared component and use it at every matching location.

- `CheckboxMultiSelect`: Province, Territory, Assigned PIC and other multi-value filters. Accepts `value` (array), `options`, `onChange` and Ant Design Select props such as `placeholder`, `aria-label`, `id`, and `notFoundContent`. Includes search, clear, responsive tags and checkbox options without a second selection tick.
- `StatusBadge`: consistent dot-and-text status display.
- `LeadMap`: customer location map with nearby controls and distance scale.
- `LeadLocationEditor`: editable map location picker.
- `ProspectForm`: shared create/edit prospect fields, section layout, validation, Full Address preview and interactive map. Pass the Ant Design `form`, `provinces`, `salespeople`, `onFinish` and optional `onValuesChange`; children provide page-specific actions. Programmatic map changes also report dirty state.
- `StatusFilterGroup`: connected status buttons with filtered totals and Pending count styling; pass status options and filtered records.
- `RecordListEmpty`: shared user-group empty state, date hierarchy and Show all dates action for Prospect and C & L lists.
