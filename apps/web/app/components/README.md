# Components Documentation

This directory contains reusable UI components for the web application.

## BaseButton (`BaseButton.vue`)
A versatile, styled button component that supports different variants and states.

### Props
- `variant` ('primary' | 'secondary' | 'outline' | 'ghost' | 'danger'): Defines the visual style of the button.
- `size` ('sm' | 'md' | 'lg'): Controls the padding and text size.
- `loading` (boolean): Displays a spinner if true.
- `disabled` (boolean): Disables the button interaction.
- `customClass` (string): Allows overriding or adding custom CSS classes.

### Usage
```vue
<template>
  <BaseButton variant="primary" size="lg" :loading="isSubmitting" @click="submit">
    Submit
  </BaseButton>
</template>
```

### Potential Issues & Errors
- **Prop Overrides:** Ensure `customClass` uses Tailwind-compatible classes. Avoid conflicts that might override structural styles.
- **Event Binding:** The component uses `v-bind="$attrs"` to pass through standard attributes; ensure that event listeners on the button element itself are not inadvertently swallowed.
