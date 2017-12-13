import React, { Component } from "react"
var Slider = require('react-slick');

class SampleNextArrow extends Component{
    render: function() {
        return <div {...this.props} style={{display: 'block', background: 'red'}}></div>;
    }
}

class SamplePrevArrow extends Component{
    render: function() {
        return (
            <div {...this.props} style={{display: 'block', background: 'red'}}></div>
        );
    }
}

class PropertySlider extends Component {
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
            data : [{"name": "http://localhost/m-vacation-web-ui/storage/app/media/room-01.jpg", "price": "8,000"}, {"name": "東京", "price": "1,203"},{"name": "東京", "price": "1,203"}, {"name": "東京", "price": "1,203"}, {"name": "東京", "price": "1,203"}, {"name": "東京", "price": "1,203"},, {"name": "東京", "price": "1,203"},, {"name": "東京", "price": "1,203"}],
        }
    }

    render() {
        const settings = {
            //focusOnSelect: true,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            speed: 500,
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />
        };
        return (
            <div className="row">
                    {this.state.data.map((text, i) => {
                        return (
                    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 property-list-parent" key={i}>
                        <div className="property-single">
                            <div className="property-photo">
                                <img src={baseCmsUrl + "/storage/app/media/room-01.jpg"}/>
                                <div className="property-price-tag">
                                    ￥8,000 -
                                </div>
                            </div>
                            <div className="property-reviews">
                                <div className="reviews-stars">
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                    <i className="fa fa-star-o" aria-hidden="true"></i>
                                    <i className="fa fa-star-o" aria-hidden="true"></i>
                                    <i className="fa fa-star-o" aria-hidden="true"></i>
                                </div>
                                <div className="reviews-number">
                                    レビュー00件
                                </div>
                            </div>
                            <div className="property-description">
                                東京ドームまで17分！2016年7月オープン！ キャンペーン価格で販売中！
                            </div>
                            <div className="property-tags">
                                <div className="property-tags-single">板橋区</div>
                                <div className="property-tags-single">東京都</div>
                                <div className="property-tags-single">浅草</div>
                                <div className="property-tags-single">ゲストハウス</div>
                                <div className="property-tags-single">即時予約</div>
                                <div className="property-tags-single">5名</div>
                            </div>
                        </div>
                    </div>

                        )
                    })
                    }
            </div>
        );
    }
}
export default PropertySlider;