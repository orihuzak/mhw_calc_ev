////////////////////////////// 出力・描画 ///////////////////////////////

/**
 * ラジオボタンクラス
 */
class MyRadioButton extends React.Component{
    constructor(props){
        super(props)
        this.normalStyle = {
            backgroundColor: "#ccc",
            color: "black",
        }
        this.checkedStyle = {
            backgroundColor: "white",
            color: "orange",
        }
        this.state = {
            switch: false,
            style: this.normalStyle,
            value: this.props.value
        }
        
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(event){
        console.log("押された")
        this.setState(state => ({
            switch: !state.switch,
            style: (state.switch) ? this.normalStyle : this.checkedStyle
        }))
        this.props.onChange(event)
    }

    render(){
        const state = this.state
        return(
            <button
                className="myRadioButton"
                style={this.state.style}
                key={this.props.id}
                id={this.props.id}
                onClick={this.handleClick}>{this.props.label}</button>
        )
        
    }
}


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
function RadioButton(props){
    return (
        <div key={props.id} id={props.id} className="radioButtonBox">
            <input 
                type="radio"
                className="radioButton"
                id={props.value}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                checked={props.checkItem === props.value} />
            <label  className="radioButtonLabel" htmlFor={props.value}>
                {props.lavel}
            </label>
        </div>)
}


function plusFive(x){
    return (x - 0) + 5
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
    }

    handleChange(event){
        // 親のonChangeを呼んで親のstateを更新
        const target = event.target
        // li.calculatorのidを取得
        const id = $(target).parents(".calculator").attr("id")
        this.props.onChange(id, target.name, target.value)
    }

    selectInput(event){
        event.target.select()
    }

    render() {
        const status = this.props.status
        const inputDivs = ["attack", "affinity"].map( name => {
            return (
                <div className="inputDiv" key={name} id={name}>
                    <label>{INPUT_VARS_JP_ENG[name]}: </label>
                        <input 
                            type="number"
                            className="weaponInput"
                            name={name}
                            value={status[name]}
                            onChange={this.handleChange}
                            onClick={this.selectInput} />
                </div>
            )
        })

        const sharpnessRadioButtons = Object.keys(PHYSICAL_SHARPNESS).map( (enColor) => {
            return (
                /*
                <MyRadioButton
                    label={SHARPNESS_COLOR_JP_ENG[enColor]}
                    key={enColor}
                    id={enColor}
                    name="physicalSharpness"
                    value={enColor}
                    onClick={this.handleChange} />*/
                
                <RadioButton 
                    lavel={SHARPNESS_COLOR_JP_ENG[enColor]}
                    key={enColor}
                    id={enColor}
                    name="physicalSharpness"
                    value={enColor}
                    onChange={this.handleChange}
                    checkItem={status.physicalSharpness} />
                
            )
        })
        
        // 各スキルのラジオボタンを生成
        const skillLvInputDivs = Object.keys(SKILLS).map( skillName => {
            const radioButtons = Object.keys(SKILLS[skillName]).map( lv => {
                return (
                    <RadioButton 
                        lavel={lv}
                        key={lv}
                        id={lv}
                        name={skillName}
                        value={lv}
                        onChange={this.handleChange}
                        checkItem={status[skillName]} />
                )
            })
            return (
                
                <div className="inputDiv" key={skillName} id={skillName}>
                    <label>{SKILL_NAME_ENG_JP[skillName]}: </label>
                    <div>{radioButtons}</div>
                </div>
            )
        })

        

        return (
            <form>
                <div className="weaponStatus">
                    {inputDivs}
                    <div className="inputDiv">
                        <label>斬れ味: </label>
                        <div>{sharpnessRadioButtons}</div>
                    </div>
                </div>
                <div className="skillSection">
                    {skillLvInputDivs}
                </div>
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
                            id={key}
                            className="reset"
                            onClick={this.resetCalculator}>
                            &#x21BB;
                        </button>
                        <button
                            id={key}
                            className="new"
                            onClick={this.addCalculator}>
                            ＋
                        </button>
                        <button 
                            id={key}
                            className="close"
                            onClick={this.removeCalculator}>
                            ×
                        </button>
                    </div>
                    <EvCalculator
                        key={key}
                        id={key}
                        status={status}
                        onChange={this.handleChange} />
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



