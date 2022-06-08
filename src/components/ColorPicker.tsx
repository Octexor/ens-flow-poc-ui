import React, { useEffect } from 'react'
import { converters } from '../helpers/transformers'
import { Button, Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '@chakra-ui/react'
import { getContrastColor } from '../helpers/colorUtils';
import { ChromePicker } from 'react-color';

type ColorPickerProps = {
  onChange: (v: any) => void,
  name: string,
  value: string,
  disableAlpha?: boolean,
  width?: number | string,
  isDisabled?: boolean,
};

const ColorPicker = ({
  onChange,
  name,
  value,
  disableAlpha,
  width,
  isDisabled
}: ColorPickerProps) => {
  const [internalValue, setInternalValue] = React.useState(value || '#fff');

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          style={{
            backgroundColor: internalValue,
            color: getContrastColor(internalValue)
          }}
          isDisabled={isDisabled}
        >
          {name}
        </Button>
      </PopoverTrigger>
      <PopoverContent w="auto" overflow="hidden">
        <PopoverArrow />
        <ChromePicker
          color={value}
          onChange={c => {
            const newValue = converters.hex(c)
            setInternalValue(newValue)
            onChange(newValue)
          }}
          disableAlpha={disableAlpha}
          styles={{
            'default': {
                picker: {
                  width: (typeof width === 'number' ? `${width}px` : width),
                  background: '#202124',
                  color: '#dde0e3',
                  fontFamily: 'var(--chakra-fonts-body)'
                },
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export default ColorPicker;