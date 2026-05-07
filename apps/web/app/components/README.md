# BaseButton Component

The `BaseButton` is a reusable, accessible button component built for the FoodieFlow frontend. It supports various visual variants, sizes, and loading states.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Determines the visual style of the button. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Determines the button's padding and font size. |
| `loading` | `boolean` | `false` | If `true`, shows a spinner and disables the button. |
| `disabled` | `boolean` | `false` | If `true`, disables the button interactions. |
| `customClass` | `string` | `''` | Additional Tailwind CSS classes to apply to the button. |

## Usage

```vue
<template>
  <BaseButton variant="primary" size="lg" @click="handleAction">
    Order Now
  </BaseButton>

  <BaseButton :loading="isSubmitting" variant="danger">
    Delete Item
  </BaseButton>
</template>
```

## Styling
The button uses Tailwind CSS and includes transitions and active scale animations for better UX. Styles are defined internally via `variantClasses` and `sizeClasses` objects.
