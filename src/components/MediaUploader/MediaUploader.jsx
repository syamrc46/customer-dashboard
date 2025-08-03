import { useCallback, useMemo } from 'react';
import {
    DropZone,
    BlockStack,
    Text,
    Button,
    Thumbnail,
    InlineStack,
} from '@shopify/polaris';
import { Field, List } from 'rc-field-form';
import { uploadToGCS } from '../../utils/uploadToGcs';

const getFileTypeFromExtension = (url) => {
    const extension = url.split('.').pop().split('?')[0].toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const videoExtensions = ['mp4', 'mov', 'webm', 'avi'];

    if (imageExtensions.includes(extension)) return 'image';
    if (videoExtensions.includes(extension)) return 'video';
    return 'unknown';
};

const MediaUploader = ({ onChange, form, settings }) => {

    /**
     * handleDropZoneDrop - Uploads files to GCS
     * @param {Array} _dropFiles - Array of files dropped on the drop zone
     * @param {Array} acceptedFiles - Array of files accepted by the drop zone
     * @param {Array} _rejectedFiles - Array of files rejected by the drop zone
     */
    const handleDropZoneDrop = useCallback(async (_dropFiles, acceptedFiles, _rejectedFiles) => {
        const uploaded = await uploadToGCS(acceptedFiles);
        const fieldValues = form.getFieldsValue();
        const newMediaUrls = [...fieldValues.images, ...uploaded];
        onChange({ ...fieldValues, images: newMediaUrls });
    }, [form, onChange]);

    const onRemoveMedias = useCallback((remove, index) => {
        /**
         * taking all the form values
         */
        const fieldValues = form.getFieldsValue();
        /**
         * taking the media thats going to be removed
         */
        const removingMedia = fieldValues.images[index];
        /**
         * if there is media then we will check if the store name includes in the url
         * if its includes then it is an uploaded media so we need to remove it from the cloud
         */
        if (removingMedia) {
            /**
             * checking if the shop name includes in the media url
             */
            const isMatch = (removingMedia || "").includes('/temp/');
            if (!isMatch) {
                /**
                 * store those values in separate field so that we can identify which media is in the cloud
                 */
                onChange({ ...fieldValues, deletedMedias: [...((fieldValues || {}).deletedMedias || []), removingMedia] });
            }
        }
        setTimeout(() => {
            remove(index);
        })

    }, [form, onChange]);
    
    const renderMedia = (url, remove, index) => {
        const type = getFileTypeFromExtension(url);
        const name = url.split('/').pop();

        return (
            <BlockStack key={url} alignment="center" gap={200}>
                {type === 'image' ? (
                    <Thumbnail size="large" source={url} alt={name} />
                ) : type === 'video' ? (
                    <video
                        width={80}
                        height={80}
                        controls
                        style={{ borderRadius: 6, objectFit: 'cover' }}
                    >
                        <source src={url} />
                    </video>
                ) : (
                    <Text>Unsupported</Text>
                )}

                <BlockStack vertical spacing="extraTight">
                    {/* <Text variant="bodyMd" as="span">{name}</Text> */}
                    <Button plain destructive onClick={() => onRemoveMedias(remove, index)}>
                        Remove
                    </Button>
                </BlockStack>
            </BlockStack>
        );

    };

    const acceptTypes = useMemo(() => {
        const general = ((settings || {}).reviewWidget || {}).general || {};

        if (general.uploadImages && general.uploadVideos) return "image/*,video/*";
        if (general.uploadVideos) return "video/*";
        if (general.uploadImages) return "image/*";

        return "image/*,video/*";
    }, [settings]);
    return (
        <div >
            <BlockStack gap={400}>
                <BlockStack gap={200}>
                    <Text style={{ marginTop: '1rem' }}>
                        {(((settings || {}).translations || {}).reviewForm || {}).uploadFieldLabel || 'Upload Media'}
                    </Text>
                    <DropZone
                        allowMultiple
                        onDrop={handleDropZoneDrop}
                        accept={acceptTypes}
                        type="file"
                    >
                        <DropZone.FileUpload actionTitle="Export" />
                    </DropZone>

                </BlockStack>

                <BlockStack gap={200}>
                    <Field name={['images']}>{({ value }) => {
                        return (value || []).length > 0 && <Text  >
                            Uploaded Media
                        </Text>
                    }}
                    </Field>

                    <BlockStack  >
                        <List name={['images']}>
                            {(fields, { add, remove }) => {
                                return <InlineStack gap={600} >
                                    {
                                        (fields || []).map((field, index) => (
                                            <>

                                                <Field name={field.name}>{({ value }) => {
                                                    return (renderMedia(value, remove, field.name))
                                                }}
                                                </Field></>)
                                        )}
                                </InlineStack>
                            }}
                        </List>
                    </BlockStack>
                </BlockStack>
            </BlockStack>

        </div>
    );
};

export default MediaUploader;
