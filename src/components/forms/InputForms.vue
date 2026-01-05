<template>
  <div class="flex w-full flex-col gap-1">
    <label v-if="label" :for="inputId" :class="computedLabelClass">
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </label>
    <!-- Quando o tipo é select -->

    <div class="relative">
      <select
        v-if="type === 'select'"
        :id="inputId"
        :name="name || inputId"
        :disabled="disabled"
        :required="required"
        :class="selectedInputClass"
        v-bind="$attrs"
        @change="onInput"
        @blur="onBlur"
        @focus="onFocus"
        :value="modelValue"
      >
        <option disabled selected :value="placeholder">
          {{ placeholder }}
        </option>
        <slot name="options"></slot>
      </select>

      <div
        v-if="type === 'select'"
        class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500"
      ></div>

      <!-- Quando o tipo é text ou outro -->
      <input
        v-else
        :id="inputId"
        v-maska:unmaskedValue.unmasked="currentMask"
        :type="type || 'text'"
        :name="name || inputId"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :minlength="minlength"
        :pattern="currentPattern"
        :autocomplete="autocomplete"
        :class="computedInputClass"
        v-bind="$attrs"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
      />

      <div v-if="loading" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <div
          class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"
        ></div>
      </div>

      <div v-if="success && !loading" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <div class="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
          <div class="text-xs font-bold text-white">✓</div>
        </div>
      </div>

      <div v-if="hasError && !loading" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <div class="flex h-4 w-4 items-center justify-center rounded-full bg-red-500">
          <div class="text-xs font-bold text-white">!</div>
        </div>
      </div>

      <!-- Custom end icon -->
      <div
        v-if="(endIcon || $slots['end-icon']) && !loading && !success && !hasError"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <!-- Slot for custom icon -->
        <div
          v-if="$slots['end-icon']"
          :style="{ cursor: endIconClickable ? 'pointer' : 'default' }"
          @click="endIconClickable ? emit('end-icon-click', $event) : undefined"
        >
          <slot name="end-icon"></slot>
        </div>

        <!-- FontAwesome icon via prop -->
        <i
          v-else-if="endIcon"
          :class="[endIcon, endIconClass]"
          :style="{ cursor: endIconClickable ? 'pointer' : 'default' }"
          @click="endIconClickable ? emit('end-icon-click', $event) : undefined"
        >
        </i>
      </div>
    </div>

    <p v-if="helpText && !hasError" :class="computedHelpTextClass">
      {{ helpText }}
    </p>

    <p
      v-if="hasError"
      :class="computedErrorClass"
      role="alert"
      :aria-live="hasError ? 'polite' : undefined"
    >
      {{ validatorHintText }}
    </p>

    <p v-if="showCharCount && (maxlength || minlength)" class="text-right text-xs text-gray-500">
      {{ modelValue.length }}{{ maxlength ? `/${maxlength}` : '' }} characters
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useId } from 'vue'
import { vMaska } from 'maska/vue'
import { maskPatterns, maskRegex } from '../../helpers/regexMask'

const inputId = useId()

const unmaskedValue = ref('')

defineExpose({ unmaskedValue })

const props = withDefaults(
  defineProps<{
    label?: string
    labelClass?: string
    placeholder?: string
    type?: string
    modelValue: string
    helpText?: string
    helpTextClass?: string
    validatorHintText?: string

    pattern?: RegExp
    mask?: 'cpf' | 'cnpj' | 'phone' | 'cep'

    disabled?: boolean
    readonly?: boolean
    required?: boolean
    loading?: boolean
    success?: boolean
    noBorder?: boolean

    // Icon props
    endIcon?: string
    endIconClass?: string
    endIconClickable?: boolean

    name?: string
    maxlength?: number
    minlength?: number
    autocomplete?: string
    showCharCount?: boolean
  }>(),
  {
    type: 'text',
    disabled: false,
    readonly: false,
    required: false,
    loading: false,
    success: false,
    noBorder: false,
    endIconClickable: false,
    showCharCount: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:unmaskedValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'end-icon-click', event: MouseEvent): void
}>()

const currentMask = computed(() => {
  return props.mask ? maskPatterns[props.mask] : ''
})

const currentPattern = computed(() => {
  if (props.pattern) return props.pattern.source
  return props.mask ? maskRegex[props.mask] : undefined
})

const hasError = computed(() => {
  return Boolean(props.validatorHintText)
})

const computedLabelClass = computed(() => {
  if (props.labelClass) return props.labelClass

  const baseClass = 'block text-md font-medium leading-6 transition-colors duration-200'
  const disable = props.disabled ? 'text-gray-400' : 'text-gray-600'
  const stateClass = hasError.value ? 'text-red-700' : disable

  return `${baseClass} ${stateClass}`
})

const selectedInputClass = computed(() => {
  const baseClass = 'select w-full'
  const disable = props.disabled ? 'text-gray-400' : 'text-gray-600'
  const stateClass = hasError.value ? 'text-red-700' : disable

  return `${baseClass} ${stateClass}`
})

const computedInputClass = computed(() => {
  const baseClass = 'input w-full'
  const disable = props.disabled ? 'text-gray-400' : 'text-gray-600'
  const stateClass = hasError.value ? 'text-red-700' : disable

  return `${baseClass} ${stateClass}`
})

const computedHelpTextClass = computed(() => {
  if (props.helpTextClass) return props.helpTextClass

  const baseClass = 'text-sm leading-6 transition-colors duration-200'
  const stateClass = props.disabled ? 'text-gray-400' : 'text-gray-600'

  return `${baseClass} ${stateClass}`
})

const computedErrorClass = computed(() => {
  return 'text-sm text-red-600 font-medium'
})

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emit('update:unmaskedValue', unmaskedValue.value)
}

function onFocus(event: FocusEvent) {
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  emit('blur', event)
}
</script>
