import React from 'react';
import { Tabs, Spin, Row, Col, Radio } from 'antd';
import { GEO_OPTIONS, POS_KEY, API_ROOT, AUTH_HEADER, TOKEN_KEY } from '../constants';
import { Gallery } from './Gallery';
import { CreatePostButton } from './CreatePostButton';
import { AroundMap } from './AroundMap';

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;


export class Home extends React.Component {


    state = {
        isLoadingGeoLocation: false,
        error: '',
        isLoadingPosts: false,
        posts: [],
        topic: 'around',
    }



    componentDidMount() {
        if ('geolocation' in navigator) {
            this.setState({
                isLoadingGeoLocation: true,
            });
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLoaction,
                GEO_OPTIONS
            );

        } else {
            this.setState({
                error: "Geolocation is not supportesd."
            });
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({
            lat: latitude,
            lon: longitude,
        }));
        this.setState({
            isLoadingGeoLocation: false,
        });
        this.loadNearByPosts();
    };

    loadNearByPosts = (center, radius) => {
        const token = localStorage.getItem(TOKEN_KEY);
        const { lat, lon } = center ? center : JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius ? radius : 200000

        this.setState({
            isLoadingPosts: true,
        });

        //Fire API call
        fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`, {
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Fail to load posts.");
            })
            .then((data) => {
                console.log(data)
                if (this.state.topic === 'around'){
                    this.setState({
                        isLoadingPosts: false,
                        posts: data ? data : [],
                    });
                }
            })
            .catch((e) => {
                this.setState({
                    isLoadingPosts: false,
                    error: e.message,
                })
            })
    }

    loadFacesAroundWorld = () => {
        const token = localStorage.getItem(TOKEN_KEY);

        this.setState({
            isLoadingPosts: true,
        });

        //Fire API call
        fetch(`${API_ROOT}/cluster?term=face`, {
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Fail to load posts.");
            })
            .then((data) => {
                console.log(data)
                if (this.state.topic === 'face'){
                    this.setState({
                        isLoadingPosts: false,
                        posts: data ? data : [],
                    });
                }
            })
            .catch((e) => {
                this.setState({
                    isLoadingPosts: false,
                    error: e.message,
                })
            })
    }

    onTopicChange = (e) => {
        // console.log(e.target.value)
        const topic = e.target.value;
        this.setState({
            topic,
        })
        if (topic === 'face') {
            this.loadFacesAroundWorld();
        } else {
            this.loadNearByPosts();
        }
    }

    onFailedLoadGeoLoaction = () => {
        this.setState({
            error: 'Fail to get user location',
            isLoadingGeoLocation: false,
        })
    };

    getPanelContent = (type) => {
        const { error, posts, isLoadingGeoLocation, isLoadingPosts } = this.state;

        if (error) {
            return error;
        } else if (isLoadingGeoLocation) {
            return <Spin tip="Loading Geolocation ... " />;
        } else if (isLoadingPosts) {
            return <Spin tip="Lodaing Posts..." />;
        } else if (posts && posts.length > 0) {

            // if (image) -> getImagePosts
            // else(vedio) -> something else
            return type === 'image' ? this.getImagePosts() : this.getVideoPosts();
        } else {
            return "No nearby posts.";
        }
    };

    getImagePosts = () => {

        const images = this.state.posts
            .filter(({ type }) => type === 'image')
            .map(({ user, url, message }) => ({
                user: user,
                src: url,
                thumbnail: url,
                caption: message,
                thumbnailWidth: 400,
                thumbnailHeight: 300
            }));

        return <Gallery images={images} />;
    }

    getVideoPosts = () => {
        const video = this.state.posts
            .filter(({ type }) => type === 'video')
            .map(({ user, url, message }) => {
                return (
                    <Col span={6} key={url}>
                        <video src={url} controls className='video-block' />
                        <p > {`${user}: ${message}`}</p>
                    </Col>

                );
            });
        return (<Row gutter={32}>
            {video}
        </Row>);
    }




    render() {
        const operations = <CreatePostButton loadNearByPosts={this.loadNearByPosts} />

        return (
            <div>
                <RadioGroup onChange={this.onTopicChange} value={this.state.topic}>
                    <Radio value='around'>Posts Around Me</Radio>
                    <Radio value='face'>Faces Around the World</Radio>
                </RadioGroup>
                <Tabs className="main-tabs" tabBarExtraContent={operations}>
                    <TabPane tab="Image Post" key="1">
                        {this.getPanelContent('image')}
                    </TabPane>
                    <TabPane tab="Vedio Post" key="2">
                        {this.getPanelContent('video')}
                    </TabPane>
                    <TabPane tab="Map" key="3">
                        <AroundMap
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `600px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            posts={this.state.posts}
                            loadNearByPosts={this.state.topic === 'around' ? this.loadNearByPosts : this.loadFacesAroundWorld}
                        />
                    </TabPane>
                </Tabs>
            </div>

        )
    }
}

