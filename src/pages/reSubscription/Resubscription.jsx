import React, { useEffect, useState } from 'react';
import { Banner, BlockStack, Box, Layout, Page, Text } from '@shopify/polaris';
import Subscribed from '../../asset/check.webp';
import { useNavigate, useParams } from 'react-router-dom';
import { http } from '../../utils/http';

const Resubscription = () => {
    const [errorMessage, showErrorMessage] = useState('');
    const [loader, setLoader] = useState(false);

    const { params } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (params) {
            let data = JSON.parse(atob(params) || '{}');
            data.blocked = false;
            // http.post(`api/public/review-dashboard/reviews/unsubscribe/customer`, data).then((response) => {
            //     if ((response || {}).status !== 'success') {
            //         showErrorMessage('Something went wrong! Contact our customer support.');
            //     }
            //     setLoader(false);
            //     navigate('/');
            // }).catch(() => {
            //     showErrorMessage('Something went wrong! Contact our customer support.');
            // });
        } else {
            setLoader(false);
        }
        setTimeout(() => {
            navigate('/');
        }, 5000);
    }, []);

    return (
        !loader ? <Page narrowWidth >
            <Layout>
                <Layout.Section>
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <Box background="bg-surface" padding="500" borderRadius="300" shadow="md" width='100%' align='center' >
                            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '100px', height: '100px', marginBottom: '20px' }} >
                                <img style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '5px' }} src={Subscribed} alt='Product Image' />
                            </Box>
                            <BlockStack align='center' gap="500">
                                <Text variant='headingLg' alignment='center'>Welcome back!</Text>
                                <BlockStack align='center' gap={"300"} inlineAlign='center' >
                                    <Text alignment='center'>  We're glad to have you again.</Text>
                                    <Text alignment='center'>You’ll start receiving product review updates soon.</Text>

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
        </Page > : '')


}


export default Resubscription