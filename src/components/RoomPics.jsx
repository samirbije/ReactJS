import React from "react";
//external

import ImageGallery from './ImageGallery';

const PREFIX_URL = 'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/';

class RoomPics extends React.Component {

    constructor() {
        super();
        this.state = {
            showIndex: false,
            slideOnThumbnailHover: false,
            showBullets: true,
            infinite: true,
            showThumbnails: true,
            showFullscreenButton: true,
            showGalleryFullscreenButton: true,
            showPlayButton: true,
            showGalleryPlayButton: true,
            showNav: true,
            slideDuration: 450,
            slideInterval: 2000,
            thumbnailPosition: 'bottom',
            showVideo: {},
        };
    }
    componentDidMount() {
        this.images = [

            {
                original: `${PREFIX_URL}1.jpg`,
                thumbnail: `${PREFIX_URL}1t.jpg`,
                originalClass: 'featured-slide',
                thumbnailClass: 'featured-thumb',
                description: 'Custom class for slides & thumbnails'
            },
            {
                thumbnail: `${PREFIX_URL}3v.jpg`,
                original: `${PREFIX_URL}3v.jpg`,
                embedUrl: 'https://www.youtube.com/embed/iNJdPyoqt8U?autoplay=1&showinfo=0',
                description: 'Render custom slides within the gallery',
                renderItem: this._renderVideo.bind(this)
            },
            {
                thumbnail: `${PREFIX_URL}4v.jpg`,
                original: `${PREFIX_URL}4v.jpg`,
                embedUrl: 'https://www.youtube.com/embed/4pSzhZ76GdM?autoplay=1&showinfo=0',
                renderItem: this._renderVideo.bind(this)
            }
        ].concat(this._getStaticImages());

    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.slideInterval !== prevState.slideInterval ||
            this.state.slideDuration !== prevState.slideDuration) {
            // refresh setInterval
            this._imageGallery.pause();
            this._imageGallery.play();
        }
    }

    _onImageClick(event) {
        console.debug('clicked on image', event.target, 'at index', this._imageGallery.getCurrentIndex());
    }

    _onImageLoad(event) {
        console.debug('loaded image', event.target.src);
    }

    _onSlide(index) {
        this._resetVideo();
        console.debug('slid to index', index);
    }

    _onPause(index) {
        console.debug('paused on index', index);
    }

    _onScreenChange(fullScreenElement) {
        console.debug('isFullScreen?', !!fullScreenElement);
    }

    _onPlay(index) {
        console.debug('playing from index', index);
    }

    _handleInputChange(state, event) {
        this.setState({[state]: event.target.value});
    }

    _handleCheckboxChange(state, event) {
        this.setState({[state]: event.target.checked});
    }

    _handleThumbnailPositionChange(event) {
        this.setState({thumbnailPosition: event.target.value});
    }

    _getStaticImages() {
        let images = [];
        return images;
    }

    _resetVideo() {
        this.setState({showVideo: {}});

        if (this.state.showPlayButton) {
            this.setState({showGalleryPlayButton: true});
        }

        if (this.state.showFullscreenButton) {
            this.setState({showGalleryFullscreenButton: true});
        }
    }

    _toggleShowVideo(url) {
        this.state.showVideo[url] = !Boolean(this.state.showVideo[url]);
        this.setState({
            showVideo: this.state.showVideo
        });

        if (this.state.showVideo[url]) {
            if (this.state.showPlayButton) {
                this.setState({showGalleryPlayButton: false});
            }

            if (this.state.showFullscreenButton) {
                this.setState({showGalleryFullscreenButton: false});
            }
        }
    }

    _renderVideo(item) {
        //console.log('2');
        return (
            <div className='image-gallery-image'>
                {
                    this.state.showVideo[item.embedUrl] ?
                        <div className='video-wrapper'>
                            <a
                                className='close-video'
                                onClick={this._toggleShowVideo.bind(this, item.embedUrl)}
                            >
                            </a>
                            <iframe
                                width='560'
                                height='315'
                                src={item.embedUrl}
                                frameBorder='0'
                                allowFullScreen
                            >
                            </iframe>
                        </div>
                        :
                        <a onClick={this._toggleShowVideo.bind(this, item.embedUrl)}>
                            <div className='play-button'></div>
                            <img src={item.original}/>
                            {
                                item.description &&
                                <span
                                    className='image-gallery-description'
                                    style={{right: '0', left: 'initial'}}
                                >
                    {item.description}
                  </span>
                            }
                        </a>
                }
            </div>
        );
    }

    render() {
        let images = [];
        images.push({
            original: baseMVacationApiUrl +'/media/' + this.props.featuredPicture.id +'/data',
            thumbnail:baseMVacationApiUrl +'/media/'+ this.props.featuredPicture.id +'/data?size=150x100',
        });
        //console.log("I am from room pics");
        //console.log(this.props.ImageInfo);

         for (var i = 0; i < this.props.ImageInfo.length; i++) {
             if(this.props.featuredPicture.id!=this.props.ImageInfo[i].id) {
                 images.push({
                     original: baseMVacationApiUrl + '/media/' + this.props.ImageInfo[i].id + '/data',
                     thumbnail: baseMVacationApiUrl + '/media/' + this.props.ImageInfo[i].id + '/data?size=150x100',
                 });
             }
         }
        return (
<div>
            <section className='app'>
                <ImageGallery
                    ref={i => this._imageGallery = i}
                    items={images}
                    lazyLoad={false}
                    onClick={this._onImageClick.bind(this)}
                    onImageLoad={this._onImageLoad}
                    onSlide={this._onSlide.bind(this)}
                    onPause={this._onPause.bind(this)}
                    onScreenChange={this._onScreenChange.bind(this)}
                    onPlay={this._onPlay.bind(this)}
                    infinite={this.state.infinite}
                    showBullets={this.state.showBullets}
                    showFullscreenButton={this.state.showFullscreenButton && this.state.showGalleryFullscreenButton}
                    showPlayButton={this.state.showPlayButton && this.state.showGalleryPlayButton}
                    showThumbnails={this.state.showThumbnails}
                    showIndex={this.state.showIndex}
                    showNav={this.state.showNav}
                    thumbnailPosition={this.state.thumbnailPosition}
                    slideDuration={parseInt(this.state.slideDuration)}
                    slideInterval={parseInt(this.state.slideInterval)}
                    slideOnThumbnailHover={this.state.slideOnThumbnailHover}
                />
            </section>
</div>
        );
    }
}


export default RoomPics;