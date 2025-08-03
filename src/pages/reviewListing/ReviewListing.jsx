import {
    BlockStack,
    Frame,
    Icon,
    IndexTable,
    InlineStack,
    Link,
    Loading,
    Page,
    Text,
    Box,
    EmptyState
} from '@shopify/polaris';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../../utils/http';
import { EditMajor, DeleteMinor } from '@shopify/polaris-icons';
import dayjs from 'dayjs';
import { getUser } from '../../utils/userActions';
import Media from '../../components/MediaTag/Media';
import MediaGalleryModal from '../../components/MediaTag/MediaModal';

export default function ReviewListing() {
    const [navigate] = [useNavigate()];
    const [reviews, setReviews] = useState([]);
    const [initialLoader, setInitialLoader] = useState(true);
    const [apiLoader, setApiLoader] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const user = getUser();

    const fetchReviews = useCallback(
        () => {
            setApiLoader(true);
            http.post(`api/public/review-dashboard/reviews/list`, { email: user.email })
                .then((res) => {
                    const { status, data: { products, reviews } = {} } = res || {};
                    (reviews || []).forEach((review) => {
                        const product = (products || []).find(({ id }) => +id === +review.productId);
                        if (product) {
                            review.handle = product.handle;
                            review.productTitle = product.title;
                        }
                    });
                    if (status === 'success') setReviews(reviews);
                    setInitialLoader(false);
                    setApiLoader(false);
                });
        },
        [user]
    );

    useEffect(() => {
        if (user.email) fetchReviews();
    }, []);

    const deleteReview = useCallback((id) => {
        setApiLoader(true);
        http.deleteMethode(`api/public/review-dashboard/reviews/delete/${id}`).then((res) => {
            const { status } = res || {};
            setApiLoader(false);
        }).catch(() => {
            setApiLoader(false);
        })
    }, []);

    const handleOpenMediaModal = useCallback((media) => {
        setShowMediaModal(true);
        setSelectedMedia(media);
    }, [])

    return (
        <Page
            // backAction={{ content: 'Back to menu', onAction: () => navigate('/') }}
            title="Reviews"
            fullWidth
            primaryAction={
                <InlineStack gap="400">

                </InlineStack>
            }
        >
            <Frame>
                {(initialLoader || apiLoader) && <Loading />}
                {!reviews.length && !initialLoader ? (
                    <BlockStack>
                        <EmptyState
                            heading="No data found"
                            // secondaryAction={{}}
                            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                        >
                            {/* <p>Elevate your business by increasing the average transaction value through strategic upsells.</p> */}
                        </EmptyState>
                    </BlockStack>
                ) : (
                    ''
                )}
                {reviews.length > 0 && !initialLoader && (
                    <BlockStack gap="400">
                        <Box>
                            <IndexTable
                                itemCount={reviews.length}
                                selectable={false}
                                headings={[
                                    { title: 'Product' },
                                    { title: 'Date' },
                                    { title: 'Rating' },
                                    { title: 'Review' },
                                    { title: 'Media' },
                                    { title: 'Actions' },
                                ]}
                            >
                                {reviews.map((review, index) => {
                                    const {
                                        _id,

                                        title,
                                        description,
                                        createdAt,
                                        rating,
                                        productTitle,
                                        images = [],
                                        shop,
                                        handle,

                                    } = review;

                                    return (
                                        <IndexTable.Row id={_id} key={_id} position={index}>
                                            <IndexTable.Cell colSpan={1}>
                                                <Link
                                                    url={`https://${shop}/products/${handle}`}
                                                    target="_blank"
                                                    monochrome
                                                >
                                                    <Text as="span" tone="accent" variant="bodyMd">{productTitle}</Text>
                                                </Link>
                                            </IndexTable.Cell>


                                            <IndexTable.Cell colSpan={1}>
                                                <Text as="span" variant="bodyMd">
                                                    {dayjs(createdAt).format('MMM DD, YYYY')}
                                                </Text>
                                            </IndexTable.Cell>

                                            <IndexTable.Cell colSpan={1}>
                                                <InlineStack gap="100">

                                                    <Box maxInlineSize={20}>
                                                        <div style={{ backgroundColor: 'black', textAlign: 'center', color: 'white', borderRadius: '5px', padding: '0px 5px' }}>{`${rating} ★`}</div>
                                                    </Box>

                                                </InlineStack>
                                            </IndexTable.Cell>

                                            <IndexTable.Cell colSpan={1}>
                                                <Box style={{ whiteSpace: 'normal', maxWidth: "200px", overflow: "hidden" }}>
                                                    <BlockStack gap="100">
                                                        <span style={{ whiteSpace: 'normal', maxWidth: "200px", maxHeight: "50px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            <Text fontWeight="semibold" as="span" variant="bodyMd">
                                                                {title}
                                                            </Text>
                                                        </span>
                                                        <span style={{ whiteSpace: 'normal', maxWidth: "200px", maxHeight: "100px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            <Text as="span" variant="bodyMd">{description}</Text>
                                                        </span>
                                                    </BlockStack>
                                                </Box>
                                            </IndexTable.Cell>

                                            <IndexTable.Cell colSpan={1}>
                                                <InlineStack gap="200">
                                                    {(images || []).map((src, i) => {
                                                        return i < 4 ? (
                                                            // <img
                                                            //     key={i}
                                                            //     src={src}
                                                            //     alt={`review-media-${i}`}
                                                            //     style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                                                            // />
                                                            <Media
                                                                url={src}
                                                                key={i}
                                                                src={src}
                                                                alt={`review-media-${i}`}
                                                                style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                                                                onVideoClick={handleOpenMediaModal}
                                                            />
                                                        ) : null
                                                    }).filter(Boolean)}
                                                    {images.length > 4 && <Text as="span" variant="bodyMd">+{images.length - 4} more</Text>}
                                                </InlineStack>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell colSpan={2}>
                                                <BlockStack gap="100">
                                                    {/* <Text fontWeight="semibold" as="span" variant="bodyMd">
                                                        Actions
                                                    </Text> */}
                                                    <InlineStack gap={"400"} >
                                                        <Box onClick={() => navigate(`/edit/${_id}`)}>
                                                            <Icon source={EditMajor} ></Icon>
                                                        </Box>
                                                        <Box onClick={() => deleteReview(_id)}>
                                                            <Icon source={DeleteMinor} onClick={() => null} />
                                                        </Box>
                                                    </InlineStack>
                                                </BlockStack>
                                            </IndexTable.Cell>
                                        </IndexTable.Row>
                                    );
                                })}
                            </IndexTable>
                        </Box>
                        {showMediaModal && <MediaGalleryModal url={selectedMedia} show={showMediaModal} setModalState={setShowMediaModal} />}
                    </BlockStack>
                )}
            </Frame>
        </Page>
    );
}
