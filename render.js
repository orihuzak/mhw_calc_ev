////////////////////////////// 出力・描画 ///////////////////////////////
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
            <div className="radio-buttons-row">
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

/**
 * Calculatorのステータスを初期化する関数
 * 武器のステータスとスキルレベルを全て0で初期化します
 * @return {object} status calculatorが使用するステータスobjectです
 */
function initializeCalculatorStatus(){
    let status = {
        attack: 0,
        affinity: 0,
        physicalSharpness: "green",
        resultAttack: 0,
        resultAffinity: 0,
        resultEv: 0,
    }
    
    // スキル名とレベルを初期化
    for(let skillName of Object.keys(SKILLS)){
        status[skillName] = "0"
    }

    return status
}

class EvCalculator extends React.Component {
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.selectInput = this.selectInput.bind(this)
        this.handleButtonClick = this.handleButtonClick.bind(this)
    }

    handleChange(event){
        // 親のonChangeを呼んで親のstateを更新
        const target = event.target
        // li.calculatorのidを取得
        const id = $(target).parents(".calculator").attr("id")
        this.props.onChange(id, target.name, target.value)
    }

    handleButtonClick(event){
        const target = event.target
        const id = $(target).parents(".calculator").attr("id")
        this.props.onClick(id, target.name, target.value)
    }

    selectInput(event){
        event.target.select()
    }

    render() {
        const status = this.props.status
        const weaponInput = ["attack", "affinity"].map( name => {
            return (
                <div className="input-row" key={name} id={name}>
                    <label>{INPUT_VARS_JP_ENG[name]}: </label>
                        <input 
                            type="number"
                            className="weapon-input"
                            name={name}
                            value={status[name]}
                            onChange={this.handleChange}
                            onClick={this.selectInput} />
                </div>
            )
        })

        // 斬れ味用のラジオボタン
        // ラジオボタンに必要な情報を持つobjの配列をつくる
        const sizes = Object.keys(PHYSICAL_SHARPNESS).map( engColor => {
            return(
                {
                    id: engColor,
                    label: SHARPNESS_COLOR_JP_ENG[engColor],
                    groupName: "physicalSharpness",
                    value: engColor,
                }
            )
        })

        const sharpnessRadioButtons = <ButtonManager 
                                        sizes={sizes}
                                        onClick={this.handleButtonClick} />

        const skillButtonArea = Object.keys(SKILLS).map( skillName => {
            const sizes = Object.keys(SKILLS[skillName]).map( lv => {
                return (
                        {
                            id: lv,
                            label: lv,
                            groupName: skillName,
                            value: lv
                        }
                    )
            })
            return (
                <ButtonManager key={skillName} id={skillName} sizes={sizes} onClick={this.handleButtonClick} />
            )
        })

        const skillLabels = Object.keys(SKILLS).map( skillName => {
            return (
                <label key={skillName} id={skillName} className="skill-label">
                    {SKILL_NAME_ENG_JP[skillName]}
                </label>
            )
        })

        return (
            <form>
                <section className="weapon-status">
                    {weaponInput}
                    <div className="input-row">
                        <label>斬れ味: </label>
                        {sharpnessRadioButtons}
                    </div>
                </section>
                <section className="skill-section">
                    <div className="skill-label-area">
                        {skillLabels}
                    </div>
                    <div className="skill-button-area">
                        {skillButtonArea} 
                    </div>
                    
                </section>
                <section className="result">
                    <table>
                        <thead>
                            <tr>
                                <th>攻撃力（計算後）</th>
                                <th>合計会心率</th>
                                <th>期待値</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{status.resultAttack}</td>
                                <td>{status.resultAffinity}</td>
                                <td>{status.resultEv}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </form>
        )
    }
}

class CalculatorManager extends React.Component {
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.addCalculator = this.addCalculator.bind(this)
        this.removeCalculator = this.removeCalculator.bind(this)
        this.resetCalculator = this.resetCalculator.bind(this)
        this.state = {
            calculators:{
                [uuid4()]: initializeCalculatorStatus(),
            }
        }
    }

    handleChange(key, statusName, statusValue){
        let calculators = {...this.state.calculators}
        let calculator = {...calculators[key]}
        calculator[statusName] = statusValue
        // 計算して計算結果を反映
        const result = calcExpectedValue(calculator)
        calculator.resultAttack = result.attack
        calculator.resultAffinity = result.affinity
        calculator.resultEv = result.ev
        calculators[key] = calculator
        this.setState({ calculators })
    }

    addCalculator(event){
        const copiedStatus = this.state.calculators[event.target.id]
        const newId = uuid4()
        const calculators = {...this.state.calculators}
        calculators[newId] = copiedStatus
        this.setState({ calculators })
    }

    removeCalculator(event){
        // 現在のcalculatorの数が1なら削除しない
        if(Object.keys(this.state.calculators).length == 1){
            alert("残り１コなんで削除できません。")
            return
        }
        const calculators = {...this.state.calculators}
        delete calculators[event.target.id]
        this.setState({ calculators })
    }

    resetCalculator(event){
        const id = event.target.id
        const calculators = {...this.state.calculators}
        // リセット関数とかを設置する
        calculators[id] = initializeCalculatorStatus()
        this.setState({ calculators })
    }

    render(){
        // stateの情報をもとにliを作成
        const apps = []
        const calculators = this.state.calculators
        for(const [key, status] of Object.entries(calculators)){
            apps.push(
                <li key={key} id={key} className="calculator">
                    <div className="app-header">
                        <button
                            type="button"
                            id={key}
                            className="reset-button"
                            onClick={this.resetCalculator}>
                            &#x21BB;
                        </button>
                        <button
                            type="button"
                            id={key}
                            className="new-button"
                            onClick={this.addCalculator}>
                            ＋
                        </button>
                        <button 
                            type="button"
                            id={key}
                            className="close-button"
                            onClick={this.removeCalculator}>
                            ×
                        </button>
                    </div>
                    <EvCalculator
                        key={key}
                        id={key}
                        status={status}
                        onChange={this.handleChange}
                        onClick={this.handleChange}/>
                </li>
            )
        }
        return (<ul>{apps}</ul>)
    }
}


ReactDOM.render(
    <CalculatorManager />,
    document.getElementById("container")
)



