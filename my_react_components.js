/**
 * １つのラジオボタンをつくる関数
 * @param {string} id ラジオボタンのidとkeyプロパティに設定される値
 * @param {string} name ラジオボタンのnameプロパティに設定される値
 * @param {any} value ラジオボタンのnameプロパティに設定される値
 * @param {Function} handler ラジオボタンのonChangeプロパティに設定される関数
 * @param {any} checkItem ラジオボタンのcheckedプロパティで使用される値
 *      この値とvalueが等しい時、checkedにtrueが設定される
 * @return {Element} ラジオボタン要素
 */
function oldRadioButton(props){
    return (
        <div key={props.id} id={props.id} className="radio-button">
            <input
                type="radio"
                id={props.value}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                checked={props.checkItem === props.value} />
            <label className="radio-button-label" htmlFor={props.value}>
                {props.lavel}
            </label>
        </div>)
}

/**
 * スマホで押しやすいラジオボタン
 */
class ButtonManager extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            selectedButtonId: null
        }
        this.handleButtonClick = this.handleButtonClick.bind(this)
    }

    handleButtonClick(event){
        const target = event.target
        this.setState({
            selectedButtonId: target.id,
        })
        this.props.onClick(event)
    }

    render() {
        // propsからarrayを受け取る
        const sizes = this.props.sizes
        const buttons = sizes.map( size => {
            return (
                <RadioButton
                    key={size.id}
                    id={size.id}
                    label={size.label}
                    groupName={size.groupName}
                    value={size.value}
                    isSelected={this.state.selectedButtonId === size.id}
                    onClick={this.handleButtonClick} />
            )
        })

        return (
            <div>
                {buttons}
            </div>
        )
    }
}

const RadioButton = ({id, label, groupName, value, isSelected, onClick}) => {
    const selectedStyle = {
        backgroundColor: "white",
        color: "orange",
    }
    const normalStyle = {
        backgroundColor: "#ccc",
        color: "black",
    }
    
    return (
        <button
            type="button"
            className="my-radio-button"
            id={id}
            name={groupName}
            value={value}
            onClick={onClick}
            style={isSelected ? selectedStyle : normalStyle}
        >
            {label}
        </button>
    )
}

class TestApps extends React.Component{
    render(){
        const sizes = [0, 1, 2, 3, 4]
        return <ButtonManager sizes={sizes}/>
    }
}
  
//ReactDOM.render(<TestApps />, document.getElementById("container"));