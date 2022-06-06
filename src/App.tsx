import * as React from "react"
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  Heading,
  HStack,
  Input,
  Button,
  Switch,
  FormLabel,
  Flex,
  FormControl,
  FormErrorMessage,
  AspectRatio,
  Container,
  Stack,
  Link,
  Text,
} from "@chakra-ui/react"
import { Global, css } from '@emotion/react';
import theme from "./theme"
import usePersistate from "./helpers/usePersistate";
import {normalize} from "./helpers/ens-utils"
import FlowSlider from "./components/FlowSlider";
import genFlow from "./helpers/genFlow";

export const App = () => {
  const [src, setSrc] = React.useState('url(./img/glow.png)');
  const [name, setName] = React.useState('');
  const [normName, setNormName] = React.useState('');
  const [inputError, setInputError] = React.useState('');
  const [outputError, setOutputError] = React.useState('');
  const [isInvalid, setIsInvalid] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [cCrop, setCCrop] = usePersistate(false, 'cCrop');
  const [withLogo, setWithLogo] = usePersistate(false, 'withLogo');  
  const [dt, setDt] = usePersistate(5, 'dt');
  const [zdt, setZdt] = usePersistate(25, 'zdt');
  const [dPoints, setDPoints] = usePersistate(600, 'dpoints');
  const [iter, setIter] = usePersistate(800, 'iter');
  const [vib, setVib] = usePersistate(50, 'vib');

  const gen = () => {
    let cName = normName;
    if(normName.slice(-4) !== '.eth') {
      cName = cName + '.eth';
    }
    setLoading(true);
    if(outputError) setOutputError('');
    genFlow({name: cName, dt, zdt, dPoints, iter, vib, withLogo}).then(data => {
      if(data.status) {
        console.error(data);
        setOutputError(`Error${data.status ? ' '+data.status : ''}: ${data.data}`);
      } else {
        if(data.datauri) {
          setSrc(`url(${data.datauri})`);
        } else {
          setOutputError('Failed to generate image!');
        }
      }
    }).catch(err => {
      console.error(err);
      setOutputError(`Error: ${err.message}`);
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if(outputError) setOutputError('');
    try {
      setNormName(normalize(e.target.value));
      setIsInvalid(false);
      setInputError('');
    } catch(err: any) {
      setIsInvalid(true);
      setInputError(`Error: ${err.message}`);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      if(!isInvalid && !loading) gen();
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <Global styles={GlobalStyles} />
      <Box display="flex" flexDirection="column" textAlign="left" fontSize="xl" minH="100vh" justifyContent="space-between">
        <Grid minH="100vh" p={3}>
          <VStack spacing={6} maxW={{base: "md", md: "2xl", xl: "4xl"}} w="full" marginX="auto" pt={3}>
            <Heading size="lg">ENS Flow Generator</Heading>
            <Flex direction={{base: "column", md: "row"}} w="100%" justifyContent="center">
              <VStack flex="1">
                <AspectRatio maxW='500px' ratio={1} w="100%">
                  <Box border="2px solid" borderColor="teal.400" bgImage={src} bgSize="cover" borderRadius={cCrop ? "50%" : 0}></Box>
                </AspectRatio>

              </VStack>
              <VStack spacing={3} alignItems="flex-start" mt={{base: 6, md: 0}} flex="1" ml={{base: 0, md: 6}}>
                <FormControl isInvalid={isInvalid}>
                  <Input isInvalid={isInvalid} placeholder='ENS name' size='md' value={name} onInput={handleInput} onKeyDown={handleKeyDown}/>
                  <FormErrorMessage>{inputError}</FormErrorMessage>
                </FormControl>
                <VStack spacing={1} w="100%">
                  <FlowSlider label="Altitude:" minVal={1} maxVal={10} step={1} initVal={dt} onChange={v => setDt(v)}></FlowSlider>
                  <FlowSlider label="Dynamic:" minVal={1} maxVal={50} step={1} initVal={zdt} onChange={v => setZdt(v)}></FlowSlider>
                  <FlowSlider label="Draw Points:" minVal={100} maxVal={1000} step={100} initVal={dPoints} onChange={v => setDPoints(v)}></FlowSlider>
                  <FlowSlider label="Iterations:" minVal={100} maxVal={2000} step={100} initVal={iter} onChange={v => setIter(v)}></FlowSlider>
                  <FlowSlider label="Vibrance:" minVal={1} maxVal={100} step={1} initVal={vib} onChange={v => setVib(v)}></FlowSlider>
                </VStack>
                <HStack spacing={6}>
                  <HStack spacing={0}>
                    <FormLabel htmlFor='withLogo' mb={1}>Logo:</FormLabel>
                    <Switch colorScheme="teal" id="withLogo" isChecked={withLogo} onChange={e => setWithLogo(e.target.checked)}></Switch>
                  </HStack>
                  <HStack spacing={0}>
                    <FormLabel htmlFor="cropToggle" mb={1}>PFP Crop:</FormLabel>
                    <Switch colorScheme="teal" id="cropToggle" isChecked={cCrop} onChange={e => setCCrop(e.target.checked)}></Switch>
                  </HStack>
                </HStack>
                <FormControl isInvalid={!!outputError}>
                  <HStack>
                    <Button colorScheme="teal" flex="1" isDisabled={(name.length < 3) || isInvalid} onClick={() => gen()} loadingText='Generating...' spinnerPlacement='end' isLoading={loading}>Generate</Button>
                    <Button colorScheme="teal" flex="1" isDisabled={!src} onClick={() => downloadURI(src, normName)}>Download</Button>
                  </HStack>
                  <FormErrorMessage>{outputError}</FormErrorMessage>
                </FormControl>
              </VStack>
            </Flex>
          </VStack>
        </Grid>
        <Box
          bg={'gray.900'}
          color={'gray.200'}>
          <Container
            as={Stack}
            maxW={'6xl'}
            py={4}
            direction='row'
            spacing={4}
            justify='center'
            align='center'>
            <Text fontSize="md">Built by <Link color="teal.500" href="https://twitter.com/Octexor" target="_blank">@Octexor</Link> / <Link color="teal.500" href="https://twitter.com/ColorUnit" target="_blank">@ColorUnit</Link></Text>
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

function downloadURI(uri: string, name: string) {
  const link = document.createElement("a");
  link.download = `ENS-Flow_${name}_${Date.now()}.png`;
  link.href = uri.slice(4,-1);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}