import React, { useEffect, useState } from 'react';
import { Banner, BlockStack, Box, Button, Layout, Page, Text } from '@shopify/polaris';
import Unsubscribe from '../../asset/unsubscribe.jpg';
import { http } from '../../utils/http';
import { useNavigate, useParams } from 'react-router-dom';


const Unsubscription = () => {
    const [loader, setLoader] = useState(false);
    const [errorMessage, showErrorMessage] = useState();
    const { params } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (params) {
            let data = JSON.parse(atob(params) || '{}');
            data.blocked = true;
            // http.post(`api/public/review-dashboard/reviews/unsubscribe/customer`, data).then((response) => {
            //     if ((response || {}).status !== 'success') {
            //         showErrorMessage('Something went wrong! Contact our customer support.');
            //     }
            //     setLoader(false);
            // }).catch(() => {
            //     showErrorMessage('Something went wrong! Contact our customer support.');
            // });
        }
    }, []);

    return !loader ? (<Page narrowWidth >
        <Layout>
            <Layout.Section>
                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Box background="bg-surface" padding="500" borderRadius="300" shadow="md" width='100%' align='center' >
                        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '150px', height: '150px', marginBottom: '20px' }} >
                            <img style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '5px' }} src={Unsubscribe} alt='Product Image' />
                        </Box>
                        <BlockStack align='center' gap="500">
                            <Text variant='headingLg' alignment='center'>We are sorry to see you go.</Text>
                            <BlockStack align='center' gap={"300"} inlineAlign='center' >
                                <Text alignment='center'>  We’ve updated your preferences—you won’t hear from us about product reviews anymore.</Text>
                                <Text alignment='center'>Want to change your mind?</Text>
                                {!errorMessage ? <Box style={{ minWidth: '50%', display: 'flex', justifyContent: 'center', }}>
                                    <Button loading={loader} fullWidth onClick={() => navigate(`/review/resubscription/${params}`)}>Resubscribe here</Button>
                                </Box> : ''}
                            </BlockStack>
                            {errorMessage ? <Banner
                                title={errorMessage}
                                tone="critical"
                            >
                            </Banner> : ''}
                        </BlockStack>
                    </Box>
                </Box>
            </Layout.Section>
        </Layout>
    </Page >) : ''
}

export default Unsubscription