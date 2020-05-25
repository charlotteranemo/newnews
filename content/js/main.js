//Loads all news to the frontpage
class LoadNews extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
        };
    }
    componentDidMount() {
        fetch("/news")
        .then(resp => resp.json())
        .then(resp =>
        this.setState({
            data: resp.reverse()
        }));
        
    }
    
    render() {
            return (
                this.state.data.map((obj) =>
                <article>
                    <h1>{obj.newsTitle}</h1>
                    <p>{obj.newsContent}</p>
                    <p className="date">Published {obj.newsDate.slice(0, 10)} at {obj.newsDate.slice(11, 16)}</p>
                    <hr />
                </article>)
        );
    }
}

ReactDOM.render(<LoadNews />,
    document.getElementById('newsList'));

    //Returns the HTML for the logo
function Logo() {
    return <a href="admin.html"><img src="../pictures/news.png" alt="Logotype" id="logo" /></a>;
}

//Prints the logo
ReactDOM.render(<Logo />,
document.getElementById('header'));

//Clock and greeting
class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date(), timeOfDay: ''};
    }

    componentDidMount() {
        this.ticker = setInterval(
            () => this.change(), 
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.ticker);
    }

    //Prints out a greeting depending on the time of day
    change() {
        this.setState({
            date: new Date()
        })
        var whatTime = this.state.date.getHours();
        if(whatTime > 5 && whatTime < 10 ) {
            this.setState({timeOfDay: 'Good morning!'});
        } else if(whatTime > 9 && whatTime < 14) {
            this.setState({timeOfDay: 'Good day!'});
        } else if(whatTime > 13 && whatTime < 18) {
            this.setState({timeOfDay: 'Good afternoon!'});
        } else if(whatTime > 17 && whatTime < 21) {
            this.setState({timeOfDay: 'Good evening!'});
        } else {
            this.setState({timeOfDay: 'Good night!'});
        };
    }

    render() {
        return (
            <section id="greeting">
                <h2> {this.state.timeOfDay} It is {this.state.date.toLocaleTimeString()}.</h2>
            </section>
        );
    }
}

ReactDOM.render(<Clock />,
    document.getElementById('clock'));