import React from 'react';
var Slider = require('react-slick');



class SampleNextArrow extends React.Component{
    render() {
        const { currentSlide, slideCount, ...filteredProps } = this.props;
         return (
             <a {...filteredProps} data-slide="prev" href="javascript:void(0)" className="right carousel-control" style={{display: 'block'}} ><i className="fa fa-caret-right fa-2x" aria-hidden="true"></i></a>
        );
    }
}

class SamplePrevArrow extends React.Component{
    render() {
        const { currentSlide, slideCount, ...filteredProps } = this.props;
        return (
        <a {...filteredProps} data-slide="next" href="javascript:void(0)"  className="left carousel-control" style={{display: 'block'}}><i className="fa fa-caret-left fa-2x" aria-hidden="true"></i></a>
        );
    }
}

class PopularCity extends React.Component {
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
            popularCities:[],
        }

    }


    getPopularCity(){
        const self = this;

            let url = baseMVacationApiUrl + '/featured-city?offset=0&size=-1';

            let onSuccessMethod = (data) => {
                self.setState({
                    popularCities: data.items
                })
            }

            let onFailMethod = (err) => {
                console.log(err.responseText);
            }

            ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    componentDidMount() {
        this.getPopularCity ();
    }

    render() {
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

        let listPopularCityShow = [];
        if( this.state.popularCities.length > 0 ) {
            for(var i = 0; i <  this.state.popularCities.length; i++) {
                listPopularCityShow.push(
                    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                        <div className="project">
                            <figure>
                                <a href={baseCmsUrl + this.state.popularCities[i].searchQuery}><img src={this.state.popularCities[i].picture && this.state.popularCities[i].picture.id ? baseMVacationApiUrl + "/media/" +  this.state.popularCities[i].picture.id  + "/data?size=300x300" :  baseCmsUrl + "/storage/app/media/text.png"} className="img-responsive" /></a>
                                <a href={baseCmsUrl + this.state.popularCities[i].searchQuery}>
                                    <span className="actions">
                                        <span className="project-details">{this.state.popularCities[i].name}</span>
                                    </span>
                                </a>
                            </figure>
                        </div>
                    </div>
                    );
            }
        }
        else listPopularCityShow.push(<div></div>);
        return (
            <Slider {...settings}>
                {listPopularCityShow}
          </Slider>
        );

    }
}
export default PopularCity;