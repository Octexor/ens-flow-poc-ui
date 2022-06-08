import * as React from "react"
import {
  ChakraProvider, Box, VStack, Grid, Heading, HStack, Input, Button, Switch,
  FormLabel, Flex, FormControl, FormErrorMessage, AspectRatio, Container, Stack,
  Link, Text, Menu, MenuButton, MenuList, MenuOptionGroup, MenuItemOption, Checkbox,
} from "@chakra-ui/react"
import { Global, css } from '@emotion/react';
import { ChevronDownIcon } from "@chakra-ui/icons";
import theme from "./theme"
import usePersistate, { useHashPersistate } from "./helpers/usePersistate";
import {normalize} from "./helpers/ensUtils"
import FlowSlider from "./components/FlowSlider";
import genFlow from "./helpers/genFlow";
import gradients from "./helpers/gradients";
import { getContrastColor, pickColor } from "./helpers/colorUtils";
import ColorPicker from "./components/ColorPicker";
import './styles.css';
import useHashParam from "use-hash-param";

export const App = () => {
  const [normName, setNormName] = useHashParam('name', '');
  const [name, setName] = React.useState(normName);
  const [isInvalid, setIsInvalid] = React.useState(false);
  const [inputError, setInputError] = React.useState('');
  const [outputError, setOutputError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [src, setSrc] = React.useState('url(./img/glow.png)');
  const [gradient, setGradient] = usePersistate(gradients[0].join(','), 'gradient');
  const [g, setG] = useHashParam('g', '');
  const [gIdx, setGIdx] = usePersistate(0, 'gIdx');
  const [useMiddleColor, setUseMiddleColor] = usePersistate(true, 'mColor');
  const [c1, setC1] = usePersistate(gradients[0][0], 'c1');
  const [c2, setC2] = usePersistate(gradients[0][1], 'c2');
  const [c3, setC3] = usePersistate(gradients[0][2], 'c3');
  const [dt, setDt] = useHashPersistate(5, 'dt');
  const [zdt, setZdt] = useHashPersistate(25, 'zdt');
  const [dPoints, setDPoints] = useHashPersistate(600, 'dp');
  const [iter, setIter] = useHashPersistate(800, 'i');
  const [vib, setVib] = useHashPersistate(90, 'v');
  const [withLogo, setWithLogo] = useHashPersistate(false, 'l');
  const [cCrop, setCCrop] = usePersistate(false, 'cCrop');
  const input = React.useRef<HTMLInputElement>(null);
  
  const gradientButtonBg = `linear(to-r, ${gradient})`;
  const middleColor = useMiddleColor ? c2 : pickColor(c1, c3, 0.5);
  const gradientTextColor = getContrastColor(middleColor);
  const gradientArrowColor = getContrastColor(c3);

  const gen = () => {
    let cName = normName;
    const labels = cName.split('.');
    if(labels.length === 1) {
      cName = cName + '.eth';
    }
    if(outputError) setOutputError('');
    setLoading(true);
    genFlow({name: cName, cp: gradient, dt, zdt, dPoints, iter, vib, withLogo}).then(data => {
      if(data.status) {
        console.error(data);
        setOutputError(`Error${data.status ? ' '+data.status : ''}: ${data.data}`);
        countEvent('error', `${data.status}-${data.data}`);
      } else {
        if(data.datauri) {
          setSrc(`url(${data.datauri})`);
          countEvent('result', normName);
        } else {
          setOutputError('Failed to generate image!');
          countEvent('error', 'nouri');
        }
      }
    }).catch(err => {
      console.error(err);
      setOutputError(`Error: ${err.message}`);
      countEvent('error', err.message);
    }).finally(() => {
      setLoading(false);
    });
    countEvent('gen', normName);
    countEvent('g', gIdx+'');
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if(outputError) setOutputError('');
    try {
      setNormName(normalize(e.target.value));
      setIsInvalid(false);
      setInputError('');
    } catch(err: any) {
      setInputError(`Error: ${err.message}`);
      setIsInvalid(true);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      if(!isInvalid && !loading) gen();
    }
  }

  const updateGradient = (v: string | string[]) => {
    if(Array.isArray(v)) {
      v = v.join(',');
    }
    setGradient(v);
    const colors = v.split(',');
    setC1(colors[0]);
    if(colors.length === 2) {
      setC3(colors[1]);
      setUseMiddleColor(false);
    } else {
      setUseMiddleColor(true);
      setC2(colors[1]);
      setC3(colors[2]);
    }
  }

  React.useEffect(() => {
    const colors = useMiddleColor ? [c1, c2, c3] : [c1, c3];
    setGradient(colors.join(','));
  }, [c1, c2, c3])

  React.useEffect(() => {
    if(useMiddleColor) {
      updateGradient([c1, c2, c3]);
    } else {
      updateGradient([c1, c3]);
    }
  }, [useMiddleColor])

  React.useEffect(() => {
    setG(gradient.split(',').map((c: string) => c.slice(1)).join(','));
  }, [gradient])

  React.useEffect(() => {
    if(g) {
      updateGradient(g.split(',').map((c: string) => '#'+c).join(','));
    }
    if(input.current) {
      input.current.focus();
    }
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <Global styles={GlobalStyles} />
      <Box display="flex" flexDirection="column" textAlign="left" fontSize="xl" minH="100vh" justifyContent="space-between" style={{userSelect: 'none'}}>
        <Grid minH="100vh" p={3}>
          <VStack spacing={6} maxW={{base: "md", md: "2xl", xl: "4xl"}} w="full" marginX="auto" pt={3}>
            <Heading size="lg">ENS Flow Generator</Heading>
            <Flex direction={{base: "column", md: "row"}} w="full" justifyContent="center">
              <VStack flex="1">
                <AspectRatio maxW='500px' ratio={1} w="full">
                  <Box border="2px solid" borderColor="teal.400" bgImage={src} bgSize="cover" borderRadius={cCrop ? "50%" : 0}></Box>
                </AspectRatio>
              </VStack>
              <VStack spacing={3} alignItems="flex-start" mt={{base: 6, md: 0}} flex="1" ml={{base: 0, md: 6}}>
                <FormControl isInvalid={isInvalid} isDisabled={loading}>
                  <Input ref={input} isInvalid={isInvalid} placeholder='ENS Name' size='md' value={name} onInput={handleInput} onKeyDown={handleKeyDown} autoComplete="off" name="ensname" textAlign="center"/>
                  <FormErrorMessage>{inputError}</FormErrorMessage>
                </FormControl>
                <Box w="full">
                  <Menu>
                    <MenuButton as={Button} isDisabled={loading} w="full" rightIcon={<ChevronDownIcon />} color={gradientTextColor} style={{'--g-arrow-color': gradientArrowColor} as React.CSSProperties} _hover={{bgGradient: gradientButtonBg}} _active={{bgGradient: gradientButtonBg}} bgGradient={gradientButtonBg}>Gradient</MenuButton>
                    <MenuList className="gradientList">
                      <MenuOptionGroup defaultValue={gradients[0].join(',')} value={gradient} type='radio' onChange={v => updateGradient(v)}>
                        {
                          gradients.map((g, idx) => (
                            <MenuItemOption value={g.join(',')} key={idx} onClick={() => setGIdx(idx)}>
                              <Box w="150px" h="30px" bgGradient={`linear(to-r, ${g.join(', ')})`}></Box>
                            </MenuItemOption>
                          ))
                        }
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                </Box>
                <Flex w="full" direction="row" justifyContent="space-between">
                  <ColorPicker name="Below" value={c1} onChange={c => {setC1(c);setGIdx(-1)}} disableAlpha={true} width={300} isDisabled={loading}/>
                  <Flex>
                    <Checkbox colorScheme='teal' isChecked={useMiddleColor} onChange={e => setUseMiddleColor(e.target.checked)} isDisabled={loading}>&nbsp;</Checkbox>
                    <ColorPicker name="Middle" isDisabled={!useMiddleColor || loading} value={c2} onChange={c => {setC2(c);setGIdx(-1)}} disableAlpha={true} width={300}/>
                  </Flex>
                  <ColorPicker name="Top" value={c3} onChange={c => {setC3(c);setGIdx(-1)}} disableAlpha={true} width={300} isDisabled={loading}/>
                </Flex>
                <VStack spacing={1} w="full">
                  <FlowSlider label="Distance:" minVal={1} maxVal={10} step={1} initVal={dt} onChange={v => setDt(v)} isDisabled={loading}></FlowSlider>
                  <FlowSlider label="Dynamic:" minVal={1} maxVal={50} step={1} initVal={zdt} onChange={v => setZdt(v)} isDisabled={loading}></FlowSlider>
                  <FlowSlider label="Draw Points:" minVal={100} maxVal={1000} step={100} initVal={dPoints} onChange={v => setDPoints(v)} isDisabled={loading}></FlowSlider>
                  <FlowSlider label="Iterations:" minVal={100} maxVal={2000} step={100} initVal={iter} onChange={v => setIter(v)} isDisabled={loading}></FlowSlider>
                  <FlowSlider label="Vibrance:" minVal={5} maxVal={200} step={5} initVal={vib} onChange={v => setVib(v)} isDisabled={loading}></FlowSlider>
                </VStack>
                <HStack justifyContent="space-around" w="full">
                  <HStack spacing={0}>
                    <FormLabel htmlFor='withLogo' mb={1}>Logo:</FormLabel>
                    <Switch colorScheme="teal" id="withLogo" isChecked={withLogo} onChange={e => setWithLogo(e.target.checked)} isDisabled={loading}></Switch>
                  </HStack>
                  <HStack spacing={0}>
                    <FormLabel htmlFor="cropToggle" mb={1}>PFP Crop:</FormLabel>
                    <Switch colorScheme="teal" id="cropToggle" isChecked={cCrop} onChange={e => setCCrop(e.target.checked)}></Switch>
                  </HStack>
                </HStack>
                <FormControl isInvalid={!!outputError}>
                  <HStack>
                    <Button colorScheme="teal" flex="1" isDisabled={(name.length < 3) || isInvalid} onClick={() => gen()} loadingText='Generating...' spinnerPlacement='end' isLoading={loading}>Generate</Button>
                    <Button colorScheme="teal" flex="1" isDisabled={src.length < 100} onClick={() => downloadURI(src, `${normName}-${c1.slice(1)}${useMiddleColor ? '-'+c2.slice(1) : ''}-${c3.slice(1)}-${dt}-${zdt}-${dPoints}-${iter}-${vib}`)}>Download</Button>
                  </HStack>
                  <FormErrorMessage>{outputError}</FormErrorMessage>
                </FormControl>
              </VStack>
            </Flex>
          </VStack>
        </Grid>
        <Box bg={'gray.900'} color={'gray.200'}>
          <Container as={Stack} maxW={'6xl'} py={4} direction='row' spacing={4} justify='center' align='center'>
            <Text fontSize="md">Built by <Link bgClip='text' bgGradient={`linear(to-br, #fecc31 60%, #000)`} href="https://twitter.com/Octexor" target="_blank">@Octexor</Link> / <Link bgClip='text' bgGradient={`linear(to-r, #f00, #0f0, #00f)`} href="https://twitter.com/ColorUnit" target="_blank">@ColorUnit</Link></Text>
          </Container>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

const GlobalStyles = css`
  .js-focus-visible :focus:not([data-focus-visible-added]), .js-focus-visible [data-focus]:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
`;

function countEvent(str1: string, str2?: string) {
  const url = 'https://nullitics.com/n.gif?u=https://ensflow.colorunit.eth.limo';
  fetch(`${url}/${str1}`).catch(() => {});
  str2 && fetch(`${url}/${str1}/${encodeURI(str2)}`).catch(() => {});
}

function downloadURI(uri: string, name: string) {
  const link = document.createElement("a");
  link.download = `ENS-Flow_${name}.png`;
  link.href = uri.slice(4,-1);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}