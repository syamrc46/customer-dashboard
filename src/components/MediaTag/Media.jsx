const Media = ({ url, onVideoClick, ...props }) => {
    const isVideo = url.match(/\.(mp4|webm|ogg)$/i);

    if (isVideo) {
        return (
            <div style={{ cursor: "pointer" }} onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onVideoClick(url)
            }} {...props}>
                <video style={props.style} >
                    <source src={url} />
                    Your browser does not support the video tag.
                </video >
            </div>
        );
    }

    return <img src={url} alt="" width="320" {...props} />;
};
export default Media;