var GIPHY_API_URL = 'https://giphy.com/channel/przemeksaja93b4';
var GIPHY_PUB_KEY = 'p3iM7CR78c01uM12qo9MNJvLH7ZrfEd5';

App = React.createClass({
    getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {}
        };
    },

    handleSearch: function(searchingText) {  // 1.
        this.setState({
            loading: true  // 2.
        });
        this.getGif(searchingText, function(gif) {  // 3.
            this.setState({  // 4
                loading: false,  // a
                gif: gif,  // b
                searchingText: searchingText  // c
            });
        }.bind(this));
    },

    getGif: function (searchingText) {
        return new Promise(
            function (resolve, reject) {
                var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var data = JSON.parse(xhr.responseText).data;
                        if (data.type === 'gif') {
                            var gif = {
                                url: data.fixed_width_downsampled_url,
                                sourceUrl: data.url
                            };
                            resolve(gif);
                        } else {
                            reject(new Error('Not found'));
                        }
                    } else {
                        reject(new Error(this.statustext));
                    }
                };
                xhr.send();
            });
    },
        
    render: function() {

        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };

        return (
          <div style={styles}>
                <h1>Wyszukiwarka GIFow!</h1>
                <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
                <Search onSearch={this.handleSearch}/>
                <Gif
                    loading={this.state.loading}
                    url={this.state.gif.url}
                    sourceUrl={this.state.gif.sourceUrl}
                />
          </div>
        );
    }
});