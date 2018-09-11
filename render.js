////////////////////////////// 出力・描画 ///////////////////////////////

/**
 * Objectのvalからul要素をつくる関数
 * @param {*} props 
 */
function UlFromObjVals(props){  // 最初の文字は大文字じゃないとダメ
    const obj = props.obj
    // objectのitemを１つずつli化して、liのリストをつくる
    const listItems = Object.entries(obj).map((item) =>
        <li key={item[0].toString()}>{item[1]}</li>
    )
    return (
        <ul>{listItems}</ul>
    )
}


/**
 * １つのラジオボタンをつくる関数
 * @param {string} id ラジオボタンのidとkeyプロパティに設定される値
 * @param {string} name ラジオボタンのnameプロパティに設定される値
 * @param {any} value ラジオボタンのnameプロパティに設定される値
 * @param {Function} handler ラジオボタンのonChangeプロパティに設定される関数
 * @param {any} checkedItem ラジオボタンのcheckedプロパティで使用される値
 *      この値とvalueが等しい時、checkedにtrueが設定される
 * @return {Element} ラジオボタン要素
 */
function RadioButton(props){
    return ( 
        <label>
            <input 
                type="radio"
                key={props.id}
                id={props.id}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                checked={props.checkedItem === props.value} />
            {props.lavel}
        </label>)
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
        // 親のonChangeを呼んで親のstateを変更
        const target = event.target
        this.props.onChange(target.id, target.name, target.value)
    }

    selectInput(event){
        event.target.select()
    }

    render() {
        const id = this.props.id
        const status = this.props.status
        const inputDivs = ["attack", "affinity"].map( name => {
            return (
                <div className="inputDiv">
                    <label>{INPUT_VARS_JP_ENG[name]}: </label>
                        <input 
                            type="number"
                            key={id}
                            id={id}
                            name={name}
                            value={status[name]}
                            onChange={this.handleChange}
                            onClick={this.selectInput} />
                </div>
            )
        })

        const sharpnessRadioButtons = Object.keys(PHYSICAL_SHARPNESS).map( enColor => {
            return (
                <RadioButton 
                    lavel={SHARPNESS_COLOR_JP_ENG[enColor]}
                    id={id}
                    name="physicalSharpness"
                    value={enColor}
                    onChange={this.handleChange}
                    checkedItem={status.physicalSharpness} />
            )
        })
        
        // 各スキルのラジオボタンを生成
        const skillLvInputDivs = []
        for(const skillName of Object.keys(SKILLS)){
            const radioButtons = []
            for(const lv of Object.keys(SKILLS[skillName])){
                radioButtons.push(
                    <RadioButton 
                        lavel={lv}
                        id={id}
                        name={skillName}
                        value={lv}
                        onChange={this.handleChange}
                        checkedItem={status[skillName]} />)
            }
            skillLvInputDivs.push(
                <div className="inputDiv">
                    <label>{SKILL_NAME_ENG_JP[skillName]}: </label>
                    <div>{radioButtons}</div>
                </div>
            )
        }

        return (
            <form>
                <div className="weaponStatus">
                    {inputDivs}
                    <div className="inputDiv">
                        <label>斬れ味: </label>
                        <div>{sharpnessRadioButtons}</div>
                    </div>
                </div>
                <div className="skills">
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
                <li key={key}>
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



