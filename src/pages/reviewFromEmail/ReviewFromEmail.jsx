/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {

    Layout,
    TextField,
    Button,
    InlineStack,
    Text,
    Box,
    BlockStack,
    Image,
    Spinner,
    Checkbox,


} from '@shopify/polaris';
import { useParams } from 'react-router-dom';
import { ArrowRightMinor } from '@shopify/polaris-icons';
import Form, { Field } from 'rc-field-form';
import { StarIcon } from '../../components/StarIcon/StarIcon';
import MediaUploader from '../../components/MediaUploader/MediaUploader';
import { http } from '../../utils/http';
import { getUser, setUser } from '../../utils/userActions';
import Confetti from '../../components/Confetti/Confetti';
import StarIcons from "../../asset/starIcon.png";


const ReviewFromEmail = () => {
    const { params } = useParams();
    /**
      * Create a form instance
      */
    const [form] = Form.useForm();
    const [hovered, setHovered] = useState(null);
    const [initialValues, setInitialValues] = useState({});

    const [isloading, setIsloading] = useState(false);

    const [settings, setSettings] = useState({});

    const [submitLoader, toggleSubmitLoader] = useState(false);
    const [isReviewed, toggleReviewed] = useState(false);
    const [uploadMediachecked, setUploadMediachecked] = useState(false);

    const decodeBase64Review = (param) => {
        try {
            const decoded = decodeURIComponent(atob(param));
            console.log(JSON.parse(decoded));
            return JSON.parse(decoded);
        } catch (error) {
            console.error('Decode error:', error);
            return {};
        }
    };

    const getSettings = async (reviewData, shop) => {
        setIsloading(true);
        http.get(`api/public/review-dashboard/reviews/settings?shop=${shop}`).then((response) => {
            const { data } = response;
            console.log(data, "settings here");
            setSettings(data);
            /**
             * Update the form with the saved upsell details
             */

            if (reviewData) {
                form.setFieldsValue({
                    email: reviewData.email || '',
                    name: reviewData.name || '',
                    productId: reviewData.productId || '',
                    productName: reviewData.productName || '',
                    imageUrl: reviewData.imageUrl || '',
                    rating: reviewData.rating || 0,
                    images: [],
                    deletedMedias: [],
                    title: '',
                    description: '',

                });
                setInitialValues({
                    email: reviewData.email || '',
                    name: reviewData.name || '',
                    productId: reviewData.productId || '',
                    productName: reviewData.productName || '',
                    imageUrl: reviewData.imageUrl || '',
                    rating: reviewData.rating || 0,
                    images: [],
                    deletedMedias: [],
                    title: '',
                    description: '',

                });
            }
            setIsloading(false);
        });
    }

    const checkReviewed = useCallback(({ shop, email, productId }) => {
        http.get(`api/public/review-dashboard/reviews/get-review?shop=${shop}&email=${email}&productId=${productId}`).then((response) => {
            const { data } = response;
            toggleReviewed(!!data);
        });
    }, []);

    useEffect(() => {
        if (params) {
            const data = decodeBase64Review(params);
            const user = getUser();
            setUser({ ...user || {}, shop: data.shop });
            checkReviewed(data);
            getSettings(data, data.shop);
            form.setFieldValue('name', data.name);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const allowUploadMedias = useMemo(() => {
        return (((settings || {}).reviewWidget || {}).general || {}).uploadImages || (((settings || {}).reviewWidget || {}).general || {}).uploadImages;
    }, [settings]);

    const handleFinish = (values) => {
        const user = getUser();
        const data = decodeBase64Review(params);
        // Submit API logic here
        const deepClonedValues = JSON.parse(JSON.stringify(values));
        if (!uploadMediachecked) {
            delete deepClonedValues.images;
        }
        const dataToSubmit = {
            ...initialValues,
            ...deepClonedValues,
            shop: user.shop,
            source: 'email',
            requestId: data.requestId,
        };
        if (!dataToSubmit.shop) return;
        toggleSubmitLoader(true);
        http.post(`api/public/reviews/save`, dataToSubmit).then(({ status }) => {
            toggleReviewed(true);
            toggleSubmitLoader(false);
        }).catch(() => {
            toggleSubmitLoader(false);
        });
    };

    const handleMouseEnter = (index) => setHovered(index);
    const handleMouseLeave = () => setHovered(null);
    const handleClick = (index) => {
        form.setFieldValue(['rating'], index);
    };

    const handleChange = useCallback(
        (newChecked) => setUploadMediachecked(newChecked),
        [],
    );

    return (
        <>
            {!isloading ?
                <Layout>
                    <Layout.Section>
                        {
                            !isReviewed ? <Box background="bg-surface" style={{ padding: "20px", borderRadius: "10px", backgroundColor: "#fff", margin: "30px auto", maxWidth: "600px", display: "flex", justifyContent: "center", alignItems: "center" }} borderRadius="300" shadow="md">
                                <Form form={form} onFinish={handleFinish} initialValues={initialValues}>
                                    <Field
                                        name="deletedMedias"
                                    >
                                    </Field>
                                    <BlockStack gap="400" align="center">
                                        <InlineStack gap="400" align='center'>
                                            {/* Product Image */}
                                            <Field name={['imageUrl']} >
                                                {({ value }) => (
                                                    <Image
                                                        source={value}
                                                        alt={'Product image'}
                                                        width={120}
                                                        style={{ borderRadius: 8 }}
                                                    />
                                                )}
                                            </Field>
                                        </InlineStack >


                                        {/* Prompt */}
                                        <InlineStack InlineStack gap="200" align='center' >
                                            <Field name={['productName']}>
                                                {({ value }) => (
                                                    <Text variant="headingSm" alignment="center">
                                                        What do you think about{' '}
                                                        <b>{value || 'this product'}?</b>
                                                    </Text>)}
                                            </Field>
                                        </InlineStack >

                                        {/* Star Rating */}
                                        <InlineStack InlineStack gap="200" align='center' >
                                            <Field name={['rating']} rules={[
                                                {
                                                    required: true,
                                                    message: `Rating is required.`
                                                }
                                            ]}>
                                                {({ value }) => {
                                                    return <Box style={{ display: 'flex', alignItems: 'center' }}>
                                                        {[...Array(5)].map((_, i) => {
                                                            const starIndex = i + 1;
                                                            return (
                                                                <StarIcon
                                                                    key={starIndex}
                                                                    filled={hovered != null ? starIndex <= hovered : starIndex <= value}
                                                                    onClick={() => handleClick(starIndex)}
                                                                    onMouseEnter={() => handleMouseEnter(starIndex)}
                                                                    onMouseLeave={handleMouseLeave}
                                                                    settings={settings}
                                                                />
                                                            );
                                                        })}</Box>
                                                }}
                                            </Field>
                                        </InlineStack >
                                        {/* name */}
                                        <Field
                                            name="name"
                                        >
                                            {({ value = '', onChange }) => (
                                                <TextField
                                                    label={(((settings || {}).translations || {}).reviewForm || {}).nameFieldLabel || "Name"}
                                                    placeholder={(((settings || {}).translations || {}).reviewForm || {}).nameFieldPlaceholder || "please enter your name"}
                                                    value={value}
                                                    onChange={onChange}
                                                    autoComplete="off"
                                                />
                                            )}
                                        </Field >
                                        {/* Review Title */}
                                        <Field
                                            name="title"
                                            rules={[{ required: (((settings || {}).translations || {}).reviewForm || {}).titleFieldValidation ? true : false, message: (((settings || {}).translations || {}).reviewForm || {}).titleFieldValidation || "" }]}
                                        >
                                            {({ value = '', onChange }) => (
                                                <TextField
                                                    label={(((settings || {}).translations || {}).reviewForm || {}).titleFieldLabel || "Review title"}
                                                    placeholder={(((settings || {}).translations || {}).reviewForm || {}).titleFieldPlaceholder || "Add a title to your review"}
                                                    value={value}
                                                    onChange={onChange}
                                                    autoComplete="off"
                                                    error={(form.getFieldError("title") || []).length ? (((settings || {}).translations || {}).reviewForm || {}).titleFieldValidation : ""}
                                                />
                                            )}
                                        </Field >

                                        {/* Review Body */}
                                        <Field
                                            name="description"
                                            rules={[{ required: (((settings || {}).translations || {}).reviewForm || {}).reviewValidation ? true : false, message: (((settings || {}).translations || {}).reviewForm || {}).reviewValidation || "" }]}

                                        >
                                            {({ value = '', onChange }) => (
                                                <TextField
                                                    label="Write a review"
                                                    placeholder="Please share your thoughts here"
                                                    value={value}
                                                    onChange={onChange}
                                                    multiline={4}
                                                    autoComplete="off"
                                                    error={(form.getFieldError("description") || []).length ? (((settings || {}).translations || {}).reviewForm || {}).reviewValidation : ""}
                                                />
                                            )}
                                        </Field >

                                        {allowUploadMedias && <>
                                            <Checkbox
                                                label={(((settings || {}).translations || {}).reviewForm || {}).uploadFieldLabel || "Upload media"}
                                                checked={uploadMediachecked}
                                                onChange={handleChange}
                                            />
                                            <Box style={{ display: uploadMediachecked ? "block" : "none" }}>
                                                <Field>
                                                    <MediaUploader form={form} settings={settings} />
                                                </Field>
                                            </Box>
                                        </>
                                        }

                                        {/* Disclaimer */}
                                        <Text fontWeight="regular" alignment="center" tone="subdued">
                                            By submitting your review, you consent to be contacted if necessary regarding your feedback. You also agree to Squid’s
                                            <a href="" target="_blank" rel="noopener noreferrer">Terms of Service</a>,
                                            <a href="" target="_blank" rel="noopener noreferrer">Privacy Policy</a>, and
                                            <a href="" target="_blank" rel="noopener noreferrer">Content Policy</a>.
                                        </Text>

                                        {/* Submit Button */}
                                        <Button submit icon={ArrowRightMinor} variant="primary" loading={submitLoader}>
                                            {(((settings || {}).translations || {}).reviewForm || {}).submitBtn || "Submit Review"}
                                        </Button>
                                    </BlockStack >

                                </Form >
                            </Box > :
                                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

                                    <Box background="bg-surface" style={{ padding: "20px", borderRadius: "10px", backgroundColor: "#fff", margin: "30px auto", maxWidth: "600px", display: "flex", justifyContent: "center", alignItems: "center" }} borderRadius="300" shadow="md" width='100%' align='center' >
                                        <img src={StarIcons} alt='Product' />
                                        <BlockStack align='center' gap="500">
                                            <Text variant='headingLg' alignment='center'>Congratulations🎉</Text>
                                            <BlockStack align='center' gap={"300"} inlineAlign='center' >
                                                <Text alignment='center'>Your review has already been submitted.Thank you for your feedback!</Text>
                                                <Box style={{ minWidth: '50%', display: 'flex', justifyContent: 'center', }}>
                                                    <Button fullWidth onClick={() => window.open('https://review.squidapps.co', '_blank')}>Manage reviews</Button>
                                                </Box>
                                            </BlockStack>
                                            <Confetti />
                                        </BlockStack>
                                    </Box>
                                </Box>

                        }
                    </Layout.Section >
                </Layout >

                :
                <Box style={{
                    width: "100%",
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>

                    <Spinner accessibilityLabel="Spinner example" size="large" />
                </Box>
            }
        </>
    );
};

export default ReviewFromEmail;
