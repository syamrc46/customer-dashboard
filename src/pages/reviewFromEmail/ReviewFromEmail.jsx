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
    const { params: requestId } = useParams();
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
    const [submitted, setSubmitted] = useState(false);

    const getSettings = async (shop) => {
        setIsloading(true);
        http.get(`api/public/review-dashboard/reviews/settings?shop=${shop}`).then((response) => {
            const { data } = response;
            console.log(data, "settings here");
            setSettings(data);
            setIsloading(false);
        });
    }

    const checkReviewed = useCallback(({ shop, email, productId }) => {
        http.get(`api/public/review-dashboard/reviews/get-review?shop=${shop}&email=${email}&productId=${productId}`).then((response) => {
            const { data } = response;
            toggleReviewed(!!data);
        });
    }, []);

    const getRequest = useCallback(() => {
        http.get(`api/public/review-dashboard/reviews/request?id=${requestId}`).then((response) => {
            const { data, status } = response;
            if (status !== 'success') return;
            /**
             * Update the form with the saved upsell details
             */
            if (data) {
                form.setFieldsValue({
                    email: data.email || '',
                    name: data.name || '',
                    productId: data.productId || '',
                    productName: data.productTitle || '',
                    imageUrl: data.image || '',
                    rating: data.rating || 0,
                    images: [],
                    deletedMedias: [],
                    title: '',
                    description: '',

                });
                setInitialValues({
                    email: data.email || '',
                    name: data.name || '',
                    productId: data.productId || '',
                    productName: data.productTitle || '',
                    imageUrl: data.image || '',
                    rating: data.rating || 0,
                    images: [],
                    deletedMedias: [],
                    title: '',
                    description: '',

                });
            }
            const user = getUser();
            setUser({ ...user || {}, shop: data.shop });
            setIsloading(false);
            checkReviewed(data);
            getSettings(data.shop);
        });
    }, []);

    useEffect(() => {
        if (requestId) {
            getRequest();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const allowUploadMedias = useMemo(() => {
        return (((settings || {}).reviewWidget || {}).general || {}).uploadImages || (((settings || {}).reviewWidget || {}).general || {}).uploadImages;
    }, [settings]);

    const handleFinish = async () => {
        try {
            const values = await form.validateFields();
            setSubmitted(true);
            const user = getUser();
            const deepClonedValues = JSON.parse(JSON.stringify(values));

            if (!uploadMediachecked) {
                delete deepClonedValues.images;
            }

            const dataToSubmit = {
                ...initialValues,
                ...deepClonedValues,
                shop: user.shop,
                source: 'email',
                requestId,
            };

            if (!dataToSubmit.shop) return;

            toggleSubmitLoader(true);
            http.post(`api/public/reviews/save`, dataToSubmit).then(({ status }) => {
            toggleReviewed(true);
            toggleSubmitLoader(false);
            }).catch(() => {
                toggleSubmitLoader(false);
            });
        } catch(error) {

        } finally {
            setSubmitted(true);
        }
        toggleSubmitLoader(false);
    };

    const handleMouseEnter = (index) => setHovered(index);
    const handleMouseLeave = () => setHovered(null);
    const handleClick = (index) => {
        form.setFieldValue(['rating'], index ? index: null);
    };

    const handleChange = useCallback(
        (newChecked) => setUploadMediachecked(newChecked),
        [],
    );

    const ratingValidator = useCallback((rule, value) => {
        const error = ((((settings || {}).reviewWidget || {}).translations || {}).reviewForm || {}).ratingValidation;
        if (value === 0) {
          return Promise.reject(error || 'Please select a rating.');
        }
        return Promise.resolve();
      }, [settings]);

    return (
        <>
            {!isloading ?
                <Layout>
                    <Layout.Section>
                        {
                            !isReviewed ? <Box background="bg-surface" style={{ padding: "20px", borderRadius: "10px", backgroundColor: "#fff", margin: "30px auto", maxWidth: "600px", display: "flex", justifyContent: "center", alignItems: "center" }} borderRadius="300" shadow="md">
                                <Form form={form} initialValues={initialValues}>
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
                                        </InlineStack>

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

                                                    <BlockStack align='center'>
                                                        {/* Star Rating */}
                                                        <InlineStack InlineStack gap="200" align='center'>
                                                            <Field name={['rating']} rules={[
                                                                { validator: ratingValidator }
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
                                                            {submitted && (form.getFieldError('rating') || []).length > 0 && (
                                                                <Text alignment='center' tone="critical">{form.getFieldError('rating')[0]}</Text>
                                                            )}
                                                    </BlockStack>
                                        {/* name */}
                                        <Field
                                            name="name"
                                            rules={[
                                                { required: true, message: (((settings || {}).translations || {}).reviewForm || {}).nameFieldLabel || "Name is required." },
                                            ]}
                                        >
                                            {({ value = '', onChange }) => (
                                                <TextField
                                                    label={(((settings || {}).translations || {}).reviewForm || {}).nameFieldLabel || "Name"}
                                                    placeholder={(((settings || {}).translations || {}).reviewForm || {}).nameFieldPlaceholder || "Enter your name (public)"}
                                                    value={value}
                                                    onChange={onChange}
                                                    autoComplete="off"
                                                    error={submitted && (form.getFieldError('name') || []).length > 0 && (
                                                        <Text alignment='center' tone="critical">{form.getFieldError('name')[0]}</Text>
                                                    )}
                                                />
                                            )}
                                        </Field >
                                        {/* Review Title */}
                                        <Field
                                            name="title"
                                            rules={[{ required: true, message: (((settings || {}).translations || {}).reviewForm || {}).titleFieldValidation || "Review title is required." }]}
                                        >
                                            {({ value = '', onChange }) => (
                                                <TextField
                                                    label={(((settings || {}).translations || {}).reviewForm || {}).titleFieldLabel || "Review title"}
                                                    placeholder={(((settings || {}).translations || {}).reviewForm || {}).titleFieldPlaceholder || "Add a title to your review"}
                                                    value={value}
                                                    onChange={onChange}
                                                    autoComplete="off"
                                                    error={submitted && (form.getFieldError('title') || []).length > 0 && (
                                                        <Text alignment='center' tone="critical">{form.getFieldError('title')[0]}</Text>
                                                    )}
                                                />
                                            )}
                                        </Field >

                                        {/* Review Body */}
                                        <Field
                                            name="description"
                                            rules={[{ required: true, message: (((settings || {}).translations || {}).reviewForm || {}).reviewValidation || "Review text is required." }]}
                                        >
                                            {({ value = '', onChange }) => (
                                                <TextField
                                                    label={(((settings || {}).translations || {}).reviewForm || {}).reviewFieldLabel || "Review text"}
                                                    placeholder={(((settings || {}).translations || {}).reviewForm || {}).reviewFieldPlaceholder || "Write your review here."}
                                                    value={value}
                                                    onChange={onChange}
                                                    multiline={4}
                                                    autoComplete="off"
                                                    error={submitted && (form.getFieldError('description') || []).length > 0 && (
                                                        <Text alignment='center' tone="critical">{form.getFieldError('description')[0]}</Text>
                                                    )}
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
                                            {
                                                ((((settings || {}).reviewWidget || {}).translations || {}).reviewForm || {}).instructions ?
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                    __html: ((((settings || {}).reviewWidget || {}).translations || {}).reviewForm || {}).instructions,
                                                    }}
                                                />
                                                : <>
                                                By submitting your review, you consent to be contacted if necessary regarding your feedback. You also agree to Squid’s
                                                <a href="" target="_blank" rel="noopener noreferrer"> Terms of Service</a>,
                                                <a href="" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>, and
                                                <a href="" target="_blank" rel="noopener noreferrer"> Content Policy</a>.
                                                </>
                                                }
                                        </Text>

                                        {/* Submit Button */}
                                        <Button onClick={handleFinish} icon={ArrowRightMinor} variant="primary" loading={submitLoader}>
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
