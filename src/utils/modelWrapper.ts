/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed } from 'vue'

export function useModelWrapper(props: { [x: string]: any }, emit: (arg0: string, arg1: any) => void, name = 'modelValue') { 
  return computed({ 
    get: () => props[name], 
    set: (value) => emit(`update:${name}`, value) 
  })
}