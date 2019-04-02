import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import { GEO_OPTIONS, POS_KEY, API_ROOT, AUTH_HEADER, TOKEN_KEY } from '../constants';
import { Gallery } from './Gallery';
// import src from '*.svg';

const TabPane = Tabs.TabPane;

const operations = <Button>Extra Action</Button>;



export class Home extends React.Component {
    state = {
        isLoadingGeoLocation: false,
        error: '',
        isLoadingPosts: false,
        posts: [],
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

    loadNearByPosts = () => {
        const token = localStorage.getItem(TOKEN_KEY);
        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));

        this.setState({
            isLoadingPosts: true,
        });

        //Fire API call
        fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`, {
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
                this.setState({
                    isLoadingPosts: false,
                    posts: data ? data : [],
                });
            })
            .catch((e) => {
                this.setState({
                    isLoadingPosts: false,
                    error: e.message,
                })
            })
    }

    onFailedLoadGeoLoaction = () => {

        this.setState({
            error: 'Fail to get user location',
            isLoadingGeoLocation: false,
        })
    };

    getImagePosts = () => {
        const { error, posts, isLoadingGeoLocation, isLoadingPosts } = this.state;

        if (error) {
            return error;
        } else if (isLoadingGeoLocation) {
            return <Spin tip="Loading Geolocation ... " />;
        } else if (isLoadingPosts) {
            return <Spin tip="Lodaing Posts..." />;
        } else if (posts && posts.length > 0) {
            const images = posts.map(({ user, url, message }) => ({
                user: user,
                src: url,
                thumbnail: url,
                caption: message,
                thumbnailWidth: 400,
                thumbnailHeight: 300
            }));

            return <Gallery images={images} />;
        } else {
            return "No nearby posts.";
        }
    };


    render() {
        return (
            <Tabs className="main-tabs" tabBarExtraContent={operations}>
                <TabPane tab="Image Post" key="1">
                    {this.getImagePosts()}
                </TabPane>
                <TabPane tab="Vedio Post" key="2">Content of tab 2</TabPane>
                <TabPane tab="Map" key="3">Content of tab 3</TabPane>
            </Tabs>
        )
    }
}

