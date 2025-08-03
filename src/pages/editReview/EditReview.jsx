
import { useParams } from 'react-router-dom';

import { useEffect } from 'react';
import { http } from '../../utils/http';
import { Page, Card, TextField, Box, Text, BlockStack } from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';
import Form, { Field } from 'rc-field-form';
import { StarIcon } from '../../components/StarIcon/StarIcon';
import { useState } from 'react';
import MediaUploader from '../../components/MediaUploader/MediaUploader';
import { PageLoader } from '../../components/PageLoader/PageLoader';
import { useCallback } from 'react';



const EditReview = () => {
    const { id } = useParams();
    const [navigate] = [useNavigate()];
    const [initialData, setInitialData] = useState({});
    const [hovered, setHovered] = useState(null);
    const [loader, toggleLoader] = useState(false);
    const [submitLoader, toggleSubmitLoader] = useState(false);
    const [settings, setSettings] = useState({});
    /**
        * Create a form instance
        */
    const [form] = Form.useForm();
    useEffect(() => {
        if (!id) return;
        const fetchReviewData = async () => {
            try {
                toggleLoader(true);
                const reviewRes = await http.get(`api/public/review-dashboard/reviews/get?id=${id}`);
                const reviewData = (reviewRes || {}).data;
                reviewData.deletedMedias = [];
                setInitialData(reviewData);
                form.setFieldsValue(reviewData);
                const shop = (reviewData || {}).shop;
                if (shop) {
                    const settingsRes = await http.get(`api/public/review-dashboard/reviews/settings?shop=${shop}`);
                    setSettings((settingsRes || {}).data);
                }
            } catch (error) {
                console.error('Error fetching review or settings:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchReviewData();
    }, [id, form]);
    const handleMouseEnter = (index) => setHovered(index);
    const handleMouseLeave = () => setHovered(null);
    const handleClick = (index) => {
        form.setFieldValue(['rating'], index);
    };

    const handleSubmit = useCallback(() => {
        toggleSubmitLoader(true);
        form.validateFields().then(() => {
            let values = form.getFieldsValue();
            values = { ...values, productId: initialData.productId, shop: initialData.shop, email: initialData.email, _id: initialData._id };
            http.post(`api/public/reviews/save`, values).then(({ status }) => {
                if (status === 'success') {
                    toggleSubmitLoader(false);
                    navigate('/')
                }
            }).catch(() => {
                toggleSubmitLoader(false);
            });
        }).catch(() => {
            toggleSubmitLoader(false);
        });
    }, [initialData, form, navigate]);

    return loader ? <PageLoader /> : (
        <Page
            backAction={{ content: 'Products', onAction: () => navigate('/') }}
            title="Edit your review"
            compactTitle
            primaryAction={{ content: (((settings || {}).translations || {}).reviewForm || {}).submitBtn || 'Save', onAction: handleSubmit, loading: submitLoader }}
        >

            <Card title="Credit card" sectioned>
                <Form
                    onFinish={values => {
                        console.log('Finish:', values, initialData);
                    }}
                    form={form}
                >
                    <BlockStack gap="600">
                        <Field
                            name="deletedMedias"
                        >
                        </Field>
                        {/* Review Title */}
                        <Field
                            name="name"
                            rules={[{ required: true, message: 'Please enter your name' }]}
                        >
                            {({ value = '', onChange }) => (
                                <TextField
                                    label={(((settings || {}).translations || {}).reviewForm || {}).nameFieldLabel || "Name"}
                                    placeholder={(((settings || {}).translations || {}).reviewForm || {}).nameFieldPlaceholder || "Enter your name"}
                                    value={value}
                                    onChange={onChange}
                                    autoComplete="off"
                                />
                            )}
                        </Field>
                        <Field name={['title']} rules={[
                            {
                                required: true,
                                message: `Enter a question.`
                            }
                        ]}>
                            <TextField label={(((settings || {}).translations || {}).reviewForm || {}).titleFieldLabel || "Title"} autoComplete="off" />
                        </Field>
                        <Field name={['description']} rules={[
                            {
                                required: true,
                                message: `Enter a question.`
                            }
                        ]}>
                            <TextField multiline={4} label={(((settings || {}).translations || {}).reviewForm || {}).reviewFieldLabel || "Description"} autoComplete="off" />
                        </Field>
                        <Box style={{ display: 'flex', flexDirection: 'column' }}>
                            <Text>{(((settings || {}).translations || {}).reviewForm || {}).ratingFieldLabel || "Rating"}</Text>
                            <Field name={['rating']} rules={[
                                {
                                    required: true,
                                    message: `Enter a question.`
                                }
                            ]}>
                                {({ value }) => {
                                    return <Box style={{ display: 'flex' }}>
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
                        </Box>
                        <Field>
                            <MediaUploader form={form} settings={settings} />
                        </Field>
                    </BlockStack>
                </Form>
            </Card>
        </Page >
    )
}

export default EditReview;
