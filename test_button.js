class App extends React.Component {

    render() {
      const sizes = [
        { id: 'aaa' },
        { id: 'bbb' },
        { id: 'ccc' }
      ]
      return <SizeContainer sizes={sizes} />
    }
  }
  
class SizeContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedButtonId: null
        }
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick(event, buttonId) {
        this.setState({
            selectedButtonId: buttonId
        })
    }

    render() {
        const { sizes } = this.props;

        return (
        sizes.map((size) => {
            return (
                <SizeButton
                key={size.id}
                id={size.id}
                isSelected={this.state.selectedButtonId === size.id}
                onClick={this.handleButtonClick}
                />
            )
            })
        )
    }
}

const SizeButton = ({ id, isSelected, onClick }) => {
    return (
        <div
        onClick={(event) => onClick(event, id)}
        style={{ backgroundColor: isSelected ? 'red' : 'blue' }}
        >
        {id}
        </div>
    )
};

ReactDOM.render(<App />, document.getElementById("container"));