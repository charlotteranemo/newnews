class LoadNews extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
        };
    }
    componentDidUpdate() {
        fetch("/news")
        .then(resp => resp.json())
        .then(resp =>
        this.setState({
            data: resp.reverse() //Descending order
        }));
        
    }
    
    render() {
        if(this.props.logged || this.props.isLogged) { //If logged in, print admin buttons
            return (
                    this.state.data.map((obj) =>
                    <article>
                        <h1>{obj.newsTitle}</h1>
                        <p>{obj.newsContent}</p>
                        <p className="date">Published {obj.newsDate.slice(0, 10)} at {obj.newsDate.slice(11, 16)}</p>
                        <button className="button" onClick={() => deleteNews(obj._id, this.props.logged)}>Delete news</button>
                        <button className="button" onClick={() => TheForm(obj._id, obj.newsTitle, obj.newsContent)}>Edit news</button>
                        <hr />
                    </article>)
                    
        )} else {
            return (
                this.state.data.map((obj) =>
                <article>
                    <h1>{obj.newsTitle}</h1>
                    <p>{obj.newsContent}</p>
                    <p className="date">Published {obj.newsDate.slice(0, 10)} at {obj.newsDate.slice(11, 16)}</p>
                    <hr />
                </article>)
        )};
    }
}

ReactDOM.render(<LoadNews />,
    document.getElementById('newsList'));

function Logo() {
    return <a href="admin.html"><img src="../pictures/news.png" alt="Logotype" id="logo" /></a>;
}

ReactDOM.render(<Logo />,
document.getElementById('header'));

//Loads a clock and greeting
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

//Controls every field is filled in and prints form
class Control extends React.Component {
    constructor() {
        super();
        this.state = {
            valueTitle: '',
            valueContent: '',
        }
        this.handleChangeOfTitle = this.handleChangeOfTitle.bind(this);
        this.handleChangeOfContent = this.handleChangeOfContent.bind(this);
        this.handleValidInput = this.handleValidInput.bind(this);
        
    }

    handleChangeOfTitle(event) {
        this.setState({valueTitle: event.target.value}); //Sets state of the title to what is typed in the form
    }

    handleChangeOfContent(event) {
        this.setState({valueContent: event.target.value});
    }

    handleValidInput(event) {
        if(this.state.valueTitle == '' || this.state.valueContent == '') {
            alert('You must fill out every field!');
            event.preventDefault();
        } else {
            alert('You have succesfully posted a news!');
        }
        
    }


    render() {
        if(this.props.logged) {
            return (
                <section id="newNewsForm">
                    <h3>Add news</h3>
                    <form method="POST" action="/news/add" onSubmit={this.handleValidInput}>
                        <label htmlFor="newsTitle">Title:</label><br />
                        <input type="text" name="newsTitle" placeholder="Newstitle" id="newsTitle" onChange={this.handleChangeOfTitle} /><br />
                        <label htmlFor="newsContent">Content:</label><br />
                        <textarea name="newsContent" placeholder="Newscontent" id="newsContent" onChange={this.handleChangeOfContent} ></textarea><br />
                        <input type="submit" name="submit" value="Add News" className="button" />
                    </form>
                </section>
            );
        } else {
            return null;
        }
        
        }    

}

//Checks to see if the state is logged in, and if so return a logout button
//Sets state to logged in or logged out depending on which button is pressed
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: JSON.parse(localStorage.getItem("loggedInOut")),
            loggedInOut: JSON.parse(localStorage.getItem("loggedInOut"))
        }
    }

    componentDidMount() {
        ReactDOM.render(<Control logged={this.state.loggedIn} />,
            document.getElementById("newPost"));
            
        ReactDOM.render(<LoadNews logged={this.state.loggedIn} />,
            document.getElementById("newsList"));

    }
    componentDidUpdate() {
        ReactDOM.render(<Control logged={this.state.loggedIn} />,
            document.getElementById("newPost"));
            
        ReactDOM.render(<LoadNews logged={this.state.loggedIn} />,
            document.getElementById("newsList"));
    }

        handleLogging = () => {
            ReactDOM.render(<Logging />,
                document.getElementById("logIn"));
        }
    
        handleLogin = () => {
            localStorage.setItem("loggedInOut", true); //Uses localstorage to store a state for logged in
            this.setState({loggedIn: JSON.parse(localStorage.getItem("loggedInOut"))
            });
        }

        handleLogout = () => {
            localStorage.setItem("loggedInOut", false);
            this.setState({loggedIn: JSON.parse(localStorage.getItem("loggedInOut"))
            });
        }
        

        render() {
            if(this.state.loggedIn) {
                return (
                    <button className="logBtn" onClick={this.handleLogout}>Log out</button>
                );
            } else {
                return (
                    <button className="logBtn" onClick={this.handleLogging}>Log in</button>
                );
            }
        }
}

//Handles the login form
class Logging extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedInOut: JSON.parse(localStorage.getItem("loggedInOut")),
            valueUser: '',
            valuePass: '',
        }
        this.handleChangeOfUser = this.handleChangeOfUser.bind(this);
        this.handleChangeOfPass = this.handleChangeOfPass.bind(this);
    }

    handleChangeOfUser(event) {
        this.setState({valueUser: event.target.value});
    }

    handleChangeOfPass(event) {
        this.setState({valuePass: event.target.value});
    }

    handleDetails = () => { //Hardcoded login-details
        if(this.state.valueUser == "Green" && this.state.valuePass == "Blue") {
            localStorage.setItem("loggedInOut", true);
        } else {
            localStorage.setItem("loggedInOut", false);
        }
        ReactDOM.render(<Login />,
            document.getElementById("logButton"));
    }


    render() {
        return (
            <form method="POST" action="/admin/login/">
                <label htmlFor="user">Username:</label><br />
                <input type="text" name="user" placeholder="Username" onChange={this.handleChangeOfUser} id="user" /><br />
                <label htmlFor="pass">Password:</label><br />
                <input type="password" name="pass" placeholder="********" onChange={this.handleChangeOfPass} id="pass" /><br />
                <button type="submit" name="submitLogin" value="Log in" className="button" onClick={this.handleDetails}>Log in</button>
            </form>
        )
    }
}

ReactDOM.render(<Login />,
    document.getElementById("logButton"));


function deleteNews(ID, isLogged) {
    alert("You have removed a post");

    $.ajax ({
        type: "DELETE",
        url: "/news/delete/" + ID
    })

    ReactDOM.render(<LoadNews isLogged={isLogged}/>,
        document.getElementById("newsList"));

}

function editNews(ID) {
    $.ajax ({
        type: "POST",
        url: "/news/update/" + ID
    })
    ReactDOM.render(<LoadNews />,
        document.getElementById("newsList"));
}

//Form for editing posts
class Form extends React.Component {
    constructor() {
        super();
        this.state = {
            valueTitle: '',
            valueContent: '',
            editIsClosed: true
        }
        this.handleChangeOfTitle = this.handleChangeOfTitle.bind(this);
        this.handleChangeOfContent = this.handleChangeOfContent.bind(this);
        this.handleValidInput = this.handleValidInput.bind(this);
        
    }

    handleOpening = () => {
        this.setState({editIsClosed: false
        });
    }

    handleClosing = () => {
        this.setState({editIsClosed: true
        });
    }

    handleChangeOfTitle(event) {
        this.setState({valueTitle: event.target.value});
    }

    handleChangeOfContent(event) {
        this.setState({valueContent: event.target.value});
    }

    handleValidInput(event) {
        if(this.state.valueTitle == '' || this.state.valueContent == '') {
            alert('You must fill out every field!');
            event.preventDefault();
        } else {
            alert('You have succesfully edited a news!');
        }
        
    }

    render() {
        if (this.state.editIsClosed) {
            return (
                <section id="editFormSection">
                    <h3>Edit news</h3>
                    <form>
                        <button onClick={this.handleClosing} className="closeButton">X</button>
                    </form>
                    <form method="POST" className="editForm" action={"/news/update/" + this.props.ID} onSubmit={() => editNews(this.props.ID)}>
                        <label htmlFor="newsTitle2">New title:</label><br />
                        <input type="text" name="newsTitle2" placeholder="Newstitle" id="newsTitle2" defaultValue={this.props.Title} onChange={this.handleChangeOfTitle} /><br />
                        <label htmlFor="newsContent2">New content:</label><br />
                        <textarea name="newsContent2" placeholder="Newscontent" id="newsContent2" defaultValue={this.props.Content} onChange={this.handleChangeOfContent} ></textarea><br />
                        <input type="submit" name="submit" value="Edit News" className="button" />
                    </form>
                </section>
            );
        } else {
            return null;
        }
        
    }
}      
    
function TheForm(ID, Title, Content) {
    let props = {
        ID: ID,
        Title: Title,
        Content: Content
    }
    ReactDOM.render(<Form {...props} />,
    document.getElementById('edit'));
}

