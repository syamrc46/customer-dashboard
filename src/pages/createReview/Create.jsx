import { BlockStack, Box, Button, Card, Checkbox, Divider, Frame, InlineStack, Page, TextField } from '@shopify/polaris';
import Form, { Field, List } from 'rc-field-form';
import React, { useCallback, useEffect, useState } from 'react';
import { http } from '~common/fetch';
import { getUser } from '~utils/userStorage';
import { useNavigate, useParams } from 'react-router-dom';
import debounce from '~utils/debounce';
import { useDispatch } from 'react-redux';
import { clearUpsells } from '../utils/upsellSlice';

export default function CreateUpsell() {
    const navigate = useNavigate();

    /**
     * Create a form instance
     */
    const [form] = Form.useForm();
    const { id } = useParams();
    const [apiLoader, toogleApiLoader] = useState(false);
    const [upsellBackup, setUpsellBackup] = useState({});
    const [upsellFetchApiLoader, toogleUpsellFetchApiLoader] = useState(false);
    const debouncedOnChange = debounce(() => { }, 500);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!id) return;
        toogleUpsellFetchApiLoader(true);
        http.post(`api/public/upsell/get`).then((response) => {
            const { data } = response;
            /**
             * Update the form with the saved upsell details
             */
            form.setFieldsValue({ ...data });
            toogleUpsellFetchApiLoader(false);
        });
    }, []);

    const handleSubmit = useCallback(() => {
        toogleApiLoader(true);
        /**
         * Validate the form before saving the cross sell details into the databse
         */
        form
            .validateFields()
            .then(() => {
                const values = form.getFieldsValue();
                http.post('/api/admin/upsell/save', values).then((res) => {
                    dispatch(clearUpsells());
                    toogleApiLoader(false);
                });
            })
            .catch((ex) => {
                toogleApiLoader(false);
            });
    }, []);

    return (
        <Page
            backAction={{
                content: 'Settings',
            }}
            title="Edit review"
            primaryAction={
                <Button loading={apiLoader} onClick={handleSubmit} variant="primary">
                    Save
                </Button>
            }
            fullWidth
        >
            <Frame>
                <InlineStack gap="1000" wrap={false}>
                    <div className="cross-sell-form">
                        <Card sectioned>
                            <Form form={form}>
                                <div style={{ display: 'none' }}>
                                    <Field name={['widgetId']}>
                                        <TextField />
                                    </Field>
                                    <Field name={['_id']}>
                                        <TextField />
                                    </Field>
                                    <Field name={['page']}>
                                        <TextField />
                                    </Field>
                                    <Field name={['isActive']} valuePropName="checked">
                                        <Checkbox />
                                    </Field>
                                </div>
                            </Form>
                        </Card>
                    </div>
                </InlineStack>
            </Frame>
        </Page>
    );
}
