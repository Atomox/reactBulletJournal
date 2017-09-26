let React = require('react');

// Components.
let BulletList = require('./bullet-list').BulletList;

// Helpers.
let types = require('./types');



/**
 * The main app container.
 */
class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      lists: []
    }

    this.getLists()
      .then( (data) => {
        console.log(data);
        this.initLists(data);
      });
  }

  getLists = () => {

    let url = 'http://localhost:8383/lists';

    return fetch(url)
      .then((resp) => {
        return resp.json();
        }) // Transform the data into json
      .then((data) => { 
        return Promise.resolve(data); })
      .catch((err) => {
        console.log('Fetch Error: ', err);
        Promise.reject(err);
      });
  }


  componentDidMount() {

  }

  componentWillUnmount() {

  }


  /**
     @TODO

       IN PROGRESS:

         - Server: 
          - http://localhost:8383/list/3
          - http://localhost:8383/lists

      Load state from here.
   */


  editItem = (data, toggleOn, update) => {
    this.setState(prevState => {
      let myList = prevState.lists.findIndex((obj => obj.id == data.lid));
      let myNewState = prevState;

      if (prevState.lists[myList]) {
         myNewState.lists[myList].items = prevState.lists[myList].items.map(function(obj) {
          obj.edit = (obj.id === data.id && toggleOn === true) ? true : false;
          if (obj.id === data.id && update === true) {
            obj.id = data.id;
            obj.label = data.label;
            obj.type = data.type;
            obj.done = data.done;
          }
          return obj;
        });
      }
      
      return {
        lists: myNewState.lists
      };
    });
  }

  addNewItem = (data) => {

    this.setState(prevState => {
      var lid = prevState.lists.findIndex((obj => obj.id == data.lid));
      if (lid >= 0) {
        let deepState = Object.assign({}, this.state);
        let nextId = (this.state.lists[lid].nextItemId)
          ? this.state.lists[lid].nextItemId : 1;
        deepState.lists[lid].items = prevState.lists[lid].items.concat({
            label: data.label,
            type: data.type,
            id: nextId,
            done: false,
        });
        
        /* Increment counter */
        deepState.lists[lid].nextItemId = nextId+1;

        return {
          lists: deepState.lists
        };
      }
    });
  }

  initLists = (data) => {
    this.setState(prevState => {
      return {
        lists: data
      };
    });
  }

  render() {
    return (
      <div>
        {this.state.lists.map(lists =>
            <BulletList {...lists} types={types}
              addItem={this.addNewItem}
              editItem={this.editItem} />
          )
        }
      </div>
    );
  }
}

module.exports = App;
