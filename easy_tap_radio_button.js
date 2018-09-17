class RadioButtonManager extends React.Component {
    constructor(props){
        super(props)
        this.handleButtonClick = this.handleButtonClick.bind(this)
    }

    handleButtonClick(event){
        const target = event.target
        this.props.onClick(event)
    }

    render() {
        const materials = this.props.materials
        const buttons = materials.map( material => {
            return (
                <RadioButton
                    key={material.id}
                    id={material.id}
                    className={material.className}
                    label={material.label}
                    groupName={material.groupName}
                    value={material.value}
                    selectedId={this.props.selectedButtonId}
                    onClick={this.handleButtonClick} />
            )
        })

        return (
            <div className="radio-buttons-row">
                {buttons}
            </div>
        )
    }
}

function RadioButton ({id, label, className, groupName, value, selectedId, onClick}){
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
            id={id}
            className={className}
            name={groupName}
            value={value}
            onClick={onClick}
            style={selectedId === id ? selectedStyle : normalStyle}
        >
            {label}
        </button>
    )
}

class TestApp extends React.Component {
    render(){
        const materials = [0, 1, 2, 3, 4, 5].map( num => {
            return {
                id: num.toString(),
                label: num.toString(),
                groupName: "group",
                value: num.toString()
            }
        })
        return <RadioButtonManager materials={materials} />
    }
}

ReactDOM.render(<TestApp />, document.getElementById("container"))