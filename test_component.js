function plusFive(x){
    return (x - 0) + 5
}

class TestChild extends React.Component {
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event){
        // 親のonChangeを呼んで親のstateを変更
        const target = event.target
        this.props.onChange(target.id, target.value)
    }

    render(){
        const id = this.props.id
        const value = this.props.value
        const result = plusFive(value)
        return(
            <div>
                <label>attack
                    <input
                        key={id}
                        id={id}
                        value={value}
                        onChange={this.handleChange} />
                </label>
                <label>{result}</label>
            </div>
        )
    }
}

class TestParent extends React.Component {
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.addCalculator = this.addCalculator.bind(this)
        this.removeCalculator = this.removeCalculator.bind(this)
        this.resetCalculator = this.resetCalculator.bind(this)
        this.state = {
            calculators:{
                [uuid4()]: 0,
            }
        }
    }

    handleChange(key, value){
        const calculators = {...this.state.calculators}
        calculators[key] = value
        this.setState({ calculators })
    }

    addCalculator(event){
        console.log("呼ばれてる")
        const copiedStatus = this.state.calculators[event.target.id]
        const newId = uuid4()
        const calculators = {...this.state.calculators}
        calculators[newId] = copiedStatus
        this.setState({ calculators })
    }

    removeCalculator(event){
        // 現在のcalculatorの数が1なら削除しない
        if(Object.keys(this.state.calculators).length == 1){
            console.log("計算機が1つだけなので削除しないよ")
            return
        }
        const id = event.target.id
        const calculators = {...this.state.calculators}
        delete calculators[id]
        this.setState({ calculators })
    }

    resetCalculator(event){
        const id = event.target.id
        const calculators = {...this.state.calculators}
        // リセット関数とかを設置する
        calculators[id] = 0
        this.setState({ calculators })
    }

    render(){
        // stateの情報をもとにliを作成
        const apps = []
        for(const [key, value] of Object.entries(this.state.calculators)){
            apps.push(
                <li key={key}>
                    <TestChild
                        key={key}
                        id={key}
                        value={value}
                        onChange={this.handleChange} />
                    <button
                        id={key}
                        onClick={this.addCalculator}>
                        +
                    </button>
                    <button 
                        id={key}
                        onClick={this.removeCalculator}>
                        -
                    </button>
                    <button
                        id={key}
                        onClick={this.resetCalculator}>
                        reset
                    </button>
                </li>
            )
        }
        return (<ul>{apps}</ul>)
    }
}