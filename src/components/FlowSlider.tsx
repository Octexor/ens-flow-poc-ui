import {
    VStack,
    Code,
    SliderThumb,
    Flex,
    FormLabel,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    Box,
  } from "@chakra-ui/react"
import React from "react";
import { MdGraphicEq } from 'react-icons/md';

type Props = {
  initVal: number,
  minVal: number,
  maxVal: number,
  step: number,
  label: string,
  onChange: (v: number) => void
}

const FlowSlider = ({initVal, minVal, maxVal, step, onChange, label}: Props) => {
  const [vib, setVib] = React.useState(initVal)

  return (
    <VStack spacing={0} w="100%" alignItems="flex-start">
    <FormLabel>{label}</FormLabel>
    <Flex w="100%" px={2} justifyContent="space-between" alignItems="center">
    <Slider defaultValue={initVal} min={minVal} max={maxVal} step={step} onChange={(v) => {setVib(v); onChange(v)}} flex="1 0 70%">
      <SliderTrack bg='red.100'>
        <SliderFilledTrack bg='teal' />
      </SliderTrack>
      <SliderThumb boxSize={6}>
        <Box color='teal' as={MdGraphicEq} />
      </SliderThumb>
    </Slider>
    <Code ml={6} flex="0 1 40px" textAlign="center">{vib}</Code>
    </Flex>
    </VStack>
  )
};

export default FlowSlider;