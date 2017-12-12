import React from 'react';
import { PropTypes, Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import Dropzone from 'react-dropzone';
import superagent from 'superagent';
//internal


class AccomodationPic extends React.Component{
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
            image:[],
            data_uri: null
        }
    }
    /**
     *Initial call
     *
     */
    componentDidMount() {
        //this.setstate = {
          //  data : [{"name": "東京", "price": "1,203"}, {"name": "東京", "price": "1,203"},{"name": "東京", "price": "1,203"}, {"name": "東京", "price": "1,203"}]
        //}
    }

    uplaodFile(files) {
        console.log("uplaoded" + JSON.stringify(files));
        const image=files[0]
        const url = 'http://localhost/test/test.php'

        axios.post(url, image)
            .then(function (response) {
                console.log(response.data);
               /* var arr = self.state.apps;
                arr.push(response.data);
                self.setState({apps:arr});
                self.setState({msg:[app.name + ' added ']});
                self.setState({type:false});
                */
            })
            .catch(function (error) {
                /*var errArr = [];
                errArr.push(error.response.data.message);
                error.response.data.details.forEach(function(item){
                    errArr.push(item.message);
                });
                self.setState({type:true});
                self.setState({msg:errArr});
                */
                // self.setState({msg:error.response.data});
            });
        /*
        let uploadRequest = superagent.post(url)
        uploadRequest.attach('file',image)


        uploadRequest.end((err,resp)=>{
                if (err) {
                    alert(err, null)
                    return
                }
            console.log('UPLOAD COMPLETE' + JSON.stringify(resp.body.resp))
            const uploaded = resp.body

            let updatedImages = Object.assign([],this.state.images)
            updatedImages.push(uploaded)
            this.setState({
                images:updatedImages
            })
        })
        */
    }
    removeImage(e){
        e.preventDefault()
        console.log('removeImage' +e.target.id);

        let updatedImages = Object.assign([],this.state.images)

        updatedImages.splice(e.target.id,1)
        this.setState({
            images:updatedImages
        })


    }

    handleSubmit(e) {
        //console.log('dddd');

        e.preventDefault();
        const  data = {
           // data_uri: this.state.data_uri,
            filename: this.state.filename,
            filetype: this.state.filetype
        };
       //console.log("ff" + JSON.stringify(data));
      //  const _this = this;

      //  this.setState({
     //       processing: true
   //     });
/*
        const promise = $.ajax({
            url: '/api/v1/image',
            type: "POST",
            data: {
                data_uri: this.state.data_uri,
                filename: this.state.filename,
                filetype: this.state.filetype
            },
            dataType: 'json'
        });

        promise.done(function(data){
            _this.setState({
                processing: false,
                uploaded_uri: data.uri
            });
        });
*/

        const url = 'http://localhost/test/test.php'

        axios.post(url, data)
            .then(function (response) {
                console.log("uuuuu"+response.data);
                /* var arr = self.state.apps;
                 arr.push(response.data);
                 self.setState({apps:arr});
                 self.setState({msg:[app.name + ' added ']});
                 self.setState({type:false});
                 */
            })
            .catch(function (error) {
                console.log('gg');
                /*var errArr = [];
                 errArr.push(error.response.data.message);
                 error.response.data.details.forEach(function(item){
                 errArr.push(item.message);
                 });
                 self.setState({type:true});
                 self.setState({msg:errArr});
                 */
                // self.setState({msg:error.response.data});
            });
    }

    handleFile(e) {
        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onload = (upload) => {
            this.setState({
                data_uri: upload.target.result,
                filename: file,
                filetype: file.type
            });
        };
console.log(file);
        reader.readAsDataURL(file);
    }
    render() {
        const list = this.state.image.map((image,i)=>{
            return (
                <li key={i}>
                    <img  style={{width: 72}} src={image}/>
                    <a href="#" id="{i}" onClick={this.removeImage.bind(this)}>Remove</a>
                </li>
            )
        })

        return (
            <div className="col-sm-9 form-acm">
                縲�
            <div className="col-sm-6">
                <div  id="carousel-bounding-box">
                    <div className="carousel slide" id="myCarousel">
                        <div className="carousel-inner">
                            <Carousel showArrows={true}>
                                {this.state.data.map((text, i) => {
                                    return(
                                <div  key={i}>
                                    <img src="http://lorempixel.com/900/500/sports/1/" />
                                    <p className="legend">Legend  yes samir 1</p>
                                </div>
                                    )
                                })
                                }
                            </Carousel>
                        </div>
                    </div>
                </div>
                <form onSubmit={this.handleSubmit.bind(this)} encType="multipart/form-data">
                <div className="form-group">
                    <input type="file" onChange={this.handleFile.bind(this)} />
                    <ol>
                    {list}
                    </ol>
                    <input className='btn btn-primary' type="submit" value="Upload" />
                </div>
                </form>
            </div>

                縲�縲�縲� </div>
            );
        }
}
export default AccomodationPic;