import React, { Component } from "react"
var Slider = require('react-slick');

class SampleNextArrow extends Component{
    render: function() {
        return <a {...this.props} data-slide="prev" href="javascript:void(0);"  className="right carousel-control" style={{display: 'block !important'}} ><i className="fa fa-caret-right fa-2x" aria-hidden="true"></i></a>;
    }
}

class SamplePrevArrow extends Component{
    render: function() {
        return (
            <a {...this.props} data-slide="next" href="javascript:void(0);"  className="left carousel-control" style={{display: 'block !important'}}><i className="fa fa-caret-left fa-2x" aria-hidden="true"></i></a>
        );
    }
}

class SimpleSlider extends Component {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        /**
         * @type {object}
         * @property {string} child app class
         */
        this.state = {
            data : [{"name": "東京", "price": "1,203"}, {"name": "東京", "price": "1,203"},{"name": "東京", "price": "1,203"}, {"name": "東京", "price": "1,203"}],
        }
    }

    render() {
/*
        var settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 0,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            }, {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            }, {
                breakpoint:  768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }],
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />
        };
        */

        var settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4,
            initialSlide: 0,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            }, {
                breakpoint: 700,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            }, {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }],
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />
        };

        /*const settings = {
            //focusOnSelect: true,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            speed: 500,
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />
        };*/
        return (
            <div className="popular-cities">
                <div className="row">
            <Slider {...settings}>
                    <div className="col-xs-6 col-sm-4 col-md-3 col-lg-3">
                        <div className="project">
                            <figure>
                                <img src="https://mdbootstrap.com/images/reg/reg%20(2).jpg" className="img-responsive" />
                                <span className="actions">
                            <span className="project-details">TOKYO</span>
                        </span>
                            </figure>
                        </div>
                    </div>
                <div className="col-xs-6 col-sm-4 col-md-3 col-lg-3">
                    <div className="project">
                        <figure>
                            <img src="https://mdbootstrap.com/images/reg/reg%20(1).jpg" className="img-responsive" />
                            <span className="actions">
                            <span className="project-details">TOKYO</span>
                        </span>
                        </figure>
                    </div>
                </div>
                <div className="col-xs-6 col-sm-4 col-md-3 col-lg-3">
                    <div className="project">
                        <figure>
                            <img src="https://mdbootstrap.com/images/reg/reg%20(48).jpg" className="img-responsive" />
                            <span className="actions">
                            <span className="project-details">TOKYO</span>
                        </span>
                        </figure>
                    </div>
                </div>
                <div className="col-xs-6 col-sm-4 col-md-3 col-lg-3">
                    <div className="project">
                        <figure>
                            <img src="https://mdbootstrap.com/images/reg/reg%20(15).jpg" className="img-responsive" />
                            <span className="actions">
                            <span className="project-details">TOKYO</span>
                        </span>
                        </figure>
                    </div>
                </div>
                <div className="col-xs-6 col-sm-4 col-md-3 col-lg-3">
                    <div className="project">
                        <figure>
                            <img src="https://mdbootstrap.com/images/reg/reg%20(2).jpg" className="img-responsive" />
                            <span className="actions">
                            <span className="project-details">TOKYO</span>
                        </span>
                        </figure>
                    </div>
                </div>
          </Slider>
        </div>
            </div>
        );
    }
}
export default SimpleSlider;