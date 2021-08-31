import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {
    Avatar,
    Spinner,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Flex,
} from "@chakra-ui/react"

import Chart from "./components/Chart";
import {useProtocolsQuery} from "./queries";
import ProtocolProposals from "./components/ProtocolProposals";

const App = () => {
    const protocols = useProtocolsQuery()

    return (
        <Flex width="100%" height="100vh" overflow="hidden">
            <Box width={1 / 3} overflow="scroll">
                {protocols.isLoading ? (
                    <Spinner/>
                ) : (protocols.isSuccess && protocols.data) ? (
                    <Accordion allowToggle>
                        {protocols.data.map(protocol => (
                            <AccordionItem key={protocol.cname}>
                                <AccordionButton>
                                    <Avatar src={protocol.icons?.[0]?.url} size="sm" marginRight="3"/>

                                    <Box flex="1"
                                         textAlign="left"
                                         fontWeight="semibold">
                                        {protocol.name}
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                                <AccordionPanel>
                                    <ProtocolProposals cname={protocol.cname!}/>
                                </AccordionPanel>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : protocols.isError ? (
                    <>(protocols.error as string)</>
                ) : null}
            </Box>

            <Box flexGrow={1}>
                <Switch>
                    <Route path="/protocol/:protocol/proposal/:ref_id" component={Chart} />
                    <Route render={() => "use the navigation on your left..."} />
                </Switch>
            </Box>
        </Flex>
    )
}

export default App;
