import React, { useEffect, useRef, useState } from "react";
import "./modal.css"

const MediaGalleryModal = ({ url, show, setModalState }) => {
    const modalRef = useRef(null);
    const [modalVideoUrl, setModalVideoUrl] = useState(null);

    useEffect(() => {
        if (show) {
            handleVideoClick();
        } else {
            handleClose();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    const handleVideoClick = () => {
        if (modalRef.current) {
            // wait until custom element is defined
            if (modalRef.current.show) {
                modalRef.current.show();
            } else {
                customElements.whenDefined('ui-modal').then(() => {
                    modalRef.current?.show?.();
                });
            }
        }
        setModalVideoUrl(url);
    };

    const handleClose = () => {
        if (modalRef.current) {
            if (modalRef.current.hide) {
                modalRef.current.hide();
            } else {
                customElements.whenDefined('ui-modal').then(() => {
                    modalRef.current?.hide?.();
                });
            }
        }
        setModalState(false);
        setModalVideoUrl(null);
    };

    return (
        <div className="sq-overlay">
            <div className="sq-modal">
                <ui-modal id="video-modal" ref={modalRef}>
                    <div style={{ padding: "1rem" }}>
                        {modalVideoUrl && (
                            <video
                                controls
                                style={{ width: "100%", maxHeight: "500px" }}
                                autoPlay
                            >
                                <source src={modalVideoUrl} />
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                </ui-modal>
                < button onClick={handleClose} className="sq-close-button" > X</ button>
            </div>
        </div>
    );
};

export default MediaGalleryModal;